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

    public User createCustomer(
            String username,
            String password) {

        String cleanedUsername = username.trim().toLowerCase();

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

    public User getCustomer(String username) {
        User user = userRepository
                .findByUsername(
                        username.trim().toLowerCase())
                .orElseThrow();

        if (!user.getUserType().equalsIgnoreCase("customer")) {
            throw new IllegalArgumentException(
                    "The requested user is not a customer");
        }

        return user;
    }

    public List<User> getAllCustomers() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getUserType()
                        .equalsIgnoreCase("customer"))
                .toList();
    }

    public User deposit(
            String username,
            AccountType accountType,
            BigDecimal amount) {

        validateAmount(amount);

        User customer = getCustomer(username);
        Account account = selectAccount(customer, accountType);

        account.setBalance(
                account.getBalance().add(amount));

        return userRepository.save(customer);
    }

    public User withdraw(
            String username,
            AccountType accountType,
            BigDecimal amount) {

        validateAmount(amount);

        User customer = getCustomer(username);
        Account account = selectAccount(customer, accountType);

        if (amount.compareTo(account.getBalance()) > 0) {
            throw new IllegalArgumentException(
                    "Insufficient balance in " +
                            accountType + " account");
        }

        account.setBalance(
                account.getBalance().subtract(amount));

        return userRepository.save(customer);
    }

    public User transfer(
            String username,
            AccountType fromAccountType,
            BigDecimal amount) {

        validateAmount(amount);

        User customer = getCustomer(username);

        Account source = selectAccount(customer, fromAccountType);

        Account destination = fromAccountType == AccountType.CHECKING
                ? customer.getSavingsAccount()
                : customer.getCheckingAccount();

        if (amount.compareTo(source.getBalance()) > 0) {
            throw new IllegalArgumentException(
                    "Insufficient balance in " +
                            fromAccountType + " account");
        }

        source.setBalance(
                source.getBalance().subtract(amount));

        destination.setBalance(
                destination.getBalance().add(amount));

        return userRepository.save(customer);
    }

    public User updateAccountId(
            String username,
            AccountType accountType,
            int newId) {

        validateAccountId(newId);

        User customer = getCustomer(username);
        Account account = selectAccount(customer, accountType);

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

    public void deleteCustomer(String username) {
        User customer = getCustomer(username);
        userRepository.delete(customer);
    }

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

    private int generateUniqueAccountId() {
        int generatedId;

        do {
            generatedId = ThreadLocalRandom.current()
                    .nextInt(10000, 100000);
        } while (userRepository.accountIdExists(generatedId));

        return generatedId;
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null ||
                amount.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "Amount must be greater than zero");
        }
    }

    private void validateAccountId(int accountId) {
        if (accountId < 10000 || accountId > 99999) {
            throw new IllegalArgumentException(
                    "Account ID must be a five-digit number");
        }
    }
}