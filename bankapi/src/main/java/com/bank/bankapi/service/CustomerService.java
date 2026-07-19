package com.bank.bankapi.service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bank.bankapi.model.Account;
import com.bank.bankapi.model.AccountType;
import com.bank.bankapi.model.User;
import com.bank.bankapi.model.Transaction;
import com.bank.bankapi.dto.ExternalTransferRequest;
import com.bank.bankapi.model.TransactionType;
import com.bank.bankapi.model.UserType;
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

                if (userRepository.existsByUsername(username)) {
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
                                username,
                                passwordEncoder.encode(password),
                                UserType.CUSTOMER,
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

                if (user.getUserType() == UserType.ADMIN) {
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
                                                && user.getUserType() == UserType.CUSTOMER)
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

                BigDecimal updatedBalance = account.getBalance().add(amount);

                account.setBalance(updatedBalance);

                Transaction transaction = new Transaction(
                                TransactionType.DEPOSIT,
                                accountType,
                                amount,
                                updatedBalance,
                                "Deposit",
                                null,
                                null);

                customer.addTransaction(transaction);

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

                BigDecimal updatedBalance = account.getBalance().subtract(amount);

                account.setBalance(updatedBalance);

                Transaction transaction = new Transaction(
                                TransactionType.WITHDRAWAL,
                                accountType,
                                amount.negate(),
                                updatedBalance,
                                "Withdrawal",
                                null,
                                null);

                customer.addTransaction(transaction);

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
        public User transferToAnotherCustomer(
                        String senderUsername,
                        ExternalTransferRequest request) {

                validateAmount(request.getAmount());

                User sender = getCustomer(senderUsername);

                User recipient = userRepository
                                .findByAccountId(request.getDestinationAccountId())
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Destination Account Was Not Found"));

                if (sender.getUsername().equals(recipient.getUsername())) {
                        throw new IllegalArgumentException(
                                        "You Cannot Transfer Money To Your Own Account");
                }

                Account senderAccount = selectAccount(
                                sender,
                                request.getFromAccountType());

                if (request.getAmount().compareTo(senderAccount.getBalance()) > 0) {
                        throw new IllegalArgumentException(
                                        "Insufficient Balance");
                }

                Account recipientAccount = findAccountById(
                                recipient,
                                request.getDestinationAccountId());

                senderAccount.setBalance(
                                senderAccount.getBalance().subtract(request.getAmount()));

                recipientAccount.setBalance(
                                recipientAccount.getBalance().add(request.getAmount()));

                sender.addTransaction(
                                new Transaction(
                                                TransactionType.TRANSFER_SENT,
                                                request.getFromAccountType(),
                                                request.getAmount().negate(),
                                                senderAccount.getBalance(),
                                                "Transfer To " + recipient.getUsername(),
                                                recipient.getUsername(),
                                                request.getDestinationAccountId()));

                recipient.addTransaction(
                                new Transaction(
                                                TransactionType.TRANSFER_RECEIVED,
                                                recipientAccount.getAccountType(),
                                                request.getAmount(),
                                                recipientAccount.getBalance(),
                                                "Transfer From " + sender.getUsername(),
                                                sender.getUsername(),
                                                senderAccount.getId()));

                userRepository.save(recipient);

                return userRepository.save(sender);
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

        private Account findAccountById(User user, int accountId) {
                if (user.getCheckingAccount().getId() == accountId) {
                        return user.getCheckingAccount();
                }

                if (user.getSavingsAccount().getId() == accountId) {
                        return user.getSavingsAccount();
                }

                throw new IllegalArgumentException(
                                "Destination Account Was Not Found");
        }

        /*
         * Generates a unique eight-digit account ID.
         */
        private int generateUniqueAccountId() {

                int generatedId;

                do {
                        generatedId = ThreadLocalRandom
                                        .current()
                                        .nextInt(10000000, 100000000);

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

        public List<Transaction> getTransactions(String username) {
                User customer = getCustomer(username);

                if (customer.getTransactions() == null) {
                        return List.of();
                }

                return customer.getTransactions()
                                .stream()
                                .sorted(
                                                Comparator.comparing(Transaction::getCreatedAt)
                                                                .reversed())
                                .toList();
        }

        /*
         * Verifies that an account ID contains five digits.
         */
        private void validateAccountId(int accountId) {

                if (accountId < 10000000 
                                || accountId > 99999999) {

                        throw new IllegalArgumentException(
                                        "Account ID must be a five-digit number");
                }
        }
}