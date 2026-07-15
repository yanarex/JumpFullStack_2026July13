package com.bank.bankapi.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.bank.bankapi.config.AppConfig.PasswordEncoder;
import com.bank.bankapi.model.Account;
import com.bank.bankapi.model.AccountType;
import com.bank.bankapi.model.User;
import com.bank.bankapi.repository.UserRepository;

@Service
public class CustomerService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;

        public CustomerService(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
        }

        /*
         * Creates a regular customer.
         *
         * The user type is always set to "customer",
         * so this method cannot create an admin.
         */
        public User createCustomer(
                        String username,
                        String password) {

                String cleanedUsername = cleanUsername(username);

                if (userRepository.existsByUsername(cleanedUsername)) {
                        throw new IllegalArgumentException(
                                        "Username is already taken");
                }

                Account checkingAccount = new Account(
                                generateUniqueAccountId(),
                                AccountType.CHECKING);

                Account savingsAccount = new Account(
                                generateUniqueAccountId(),
                                AccountType.SAVINGS);

                User customer = new User(
                                cleanedUsername,
                                passwordEncoder.encode(password),
                                "customer",
                                checkingAccount,
                                savingsAccount);

                return userRepository.save(customer);
        }

        /*
         * Finds one customer by username.
         *
         * This method rejects admins even if their username exists.
         */
        public User getCustomer(String username) {

                String cleanedUsername = cleanUsername(username);

                User user = userRepository
                                .findByUsername(cleanedUsername)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Customer not found: "
                                                                + cleanedUsername));

                if (!user.getUserType().equalsIgnoreCase("customer")) {
                        throw new IllegalArgumentException(
                                        "The requested user is not a customer");
                }

                return user;
        }

        /*
         * Returns only customers.
         * Admin users are not included.
         */
        public List<User> getAllCustomers() {

                return userRepository
                                .findAll()
                                .stream()
                                .filter(user -> user.getUserType() != null
                                                && user.getUserType()
                                                                .equalsIgnoreCase("customer"))
                                .toList();
        }

        /*
         * Deposits money into a customer's selected account.
         */
        public User deposit(
                        String username,
                        AccountType accountType,
                        BigDecimal amount) {

                validateAmount(amount);

                User customer = getCustomer(username);
                Account account = selectAccount(
                                customer,
                                accountType);

                account.setBalance(
                                account.getBalance().add(amount));

                return userRepository.save(customer);
        }

        /*
         * Withdraws money from a customer's selected account.
         */
        public User withdraw(
                        String username,
                        AccountType accountType,
                        BigDecimal amount) {

                validateAmount(amount);

                User customer = getCustomer(username);
                Account account = selectAccount(
                                customer,
                                accountType);

                if (amount.compareTo(account.getBalance()) > 0) {
                        throw new IllegalArgumentException(
                                        "Insufficient balance in "
                                                        + accountType
                                                        + " account");
                }

                account.setBalance(
                                account.getBalance().subtract(amount));

                return userRepository.save(customer);
        }

        /*
         * Transfers money between the same customer's
         * checking and savings accounts.
         *
         * This preserves your original transfer functionality.
         */
        public User transfer(
                        String username,
                        AccountType fromAccountType,
                        BigDecimal amount) {

                validateAmount(amount);

                User customer = getCustomer(username);

                Account source = selectAccount(
                                customer,
                                fromAccountType);

                Account destination = fromAccountType == AccountType.CHECKING
                                ? customer.getSavingsAccount()
                                : customer.getCheckingAccount();

                if (amount.compareTo(source.getBalance()) > 0) {
                        throw new IllegalArgumentException(
                                        "Insufficient balance in "
                                                        + fromAccountType
                                                        + " account");
                }

                source.setBalance(
                                source.getBalance().subtract(amount));

                destination.setBalance(
                                destination.getBalance().add(amount));

                return userRepository.save(customer);
        }

        /*
         * Transfers money from one customer to another customer.
         *
         * Customers are identified by username.
         * The source and destination account types can each be
         * CHECKING or SAVINGS.
         */
        public void transferBetweenCustomers(
                        String fromUsername,
                        String toUsername,
                        AccountType fromAccountType,
                        AccountType toAccountType,
                        BigDecimal amount) {

                validateAmount(amount);

                String cleanedFromUsername = cleanUsername(fromUsername);

                String cleanedToUsername = cleanUsername(toUsername);

                User sourceCustomer = getCustomer(cleanedFromUsername);

                User destinationCustomer = getCustomer(cleanedToUsername);

                Account sourceAccount = selectAccount(
                                sourceCustomer,
                                fromAccountType);

                Account destinationAccount = selectAccount(
                                destinationCustomer,
                                toAccountType);

                /*
                 * Prevent transferring from an account
                 * directly back into the same account.
                 */
                boolean sameCustomer = cleanedFromUsername.equals(
                                cleanedToUsername);

                boolean sameAccountType = fromAccountType == toAccountType;

                if (sameCustomer && sameAccountType) {
                        throw new IllegalArgumentException(
                                        "Source and destination cannot be the same account");
                }

                if (amount.compareTo(
                                sourceAccount.getBalance()) > 0) {

                        throw new IllegalArgumentException(
                                        "Insufficient balance in "
                                                        + cleanedFromUsername
                                                        + "'s "
                                                        + fromAccountType
                                                        + " account");
                }

                sourceAccount.setBalance(
                                sourceAccount.getBalance()
                                                .subtract(amount));

                destinationAccount.setBalance(
                                destinationAccount.getBalance()
                                                .add(amount));

                /*
                 * When both accounts belong to the same customer,
                 * save that customer once.
                 */
                if (sameCustomer) {
                        userRepository.save(sourceCustomer);
                        return;
                }

                /*
                 * When the accounts belong to different customers,
                 * save both modified customer documents.
                 */
                userRepository.save(sourceCustomer);
                userRepository.save(destinationCustomer);
        }

        /*
         * Changes an account's five-digit ID.
         */
        public User updateAccountId(
                        String username,
                        AccountType accountType,
                        int newId) {

                validateAccountId(newId);

                User customer = getCustomer(username);

                Account account = selectAccount(
                                customer,
                                accountType);

                if (account.getId() == newId) {
                        return customer;
                }

                if (userRepository.accountIdExists(newId)) {
                        throw new IllegalArgumentException(
                                        "Account ID is already in use");
                }

                account.setId(newId);

                return userRepository.save(customer);
        }

        /*
         * Deletes a customer.
         *
         * getCustomer() ensures the selected user has
         * the "customer" user type. Therefore, an admin
         * cannot be deleted through this method.
         */
        public void deleteCustomer(String username) {

                User customer = getCustomer(username);
                userRepository.delete(customer);
        }

        /*
         * Returns either the checking or savings account.
         */
        private Account selectAccount(
                        User customer,
                        AccountType accountType) {

                if (accountType == null) {
                        throw new IllegalArgumentException(
                                        "Account type is required");
                }

                return switch (accountType) {
                        case CHECKING ->
                                customer.getCheckingAccount();

                        case SAVINGS ->
                                customer.getSavingsAccount();
                };
        }

        /*
         * Generates a unique five-digit account ID.
         */
        private int generateUniqueAccountId() {

                int generatedId;

                do {
                        generatedId = ThreadLocalRandom
                                        .current()
                                        .nextInt(10000, 100000);

                } while (userRepository.accountIdExists(
                                generatedId));

                return generatedId;
        }

        /*
         * Makes usernames consistent before searching MongoDB.
         */
        private String cleanUsername(String username) {

                if (username == null
                                || username.isBlank()) {

                        throw new IllegalArgumentException(
                                        "Username is required");
                }

                return username
                                .trim()
                                .toLowerCase();
        }

        /*
         * Verifies that transaction amounts are positive.
         */
        private void validateAmount(BigDecimal amount) {

                if (amount == null
                                || amount.compareTo(
                                                BigDecimal.ZERO) <= 0) {

                        throw new IllegalArgumentException(
                                        "Amount must be greater than zero");
                }
        }

        /*
         * Verifies that an account ID contains five digits.
         */
        private void validateAccountId(int accountId) {

                if (accountId < 10000
                                || accountId > 99999) {

                        throw new IllegalArgumentException(
                                        "Account ID must be a five-digit number");
                }
        }
}