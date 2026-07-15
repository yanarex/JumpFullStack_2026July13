package com.bank.bankapi.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.bank.bankapi.config.AppConfig.PasswordEncoder;
import com.bank.bankapi.model.Account;
import com.bank.bankapi.model.AccountType;
import com.bank.bankapi.model.User;
import com.bank.bankapi.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService(
                userRepository,
                passwordEncoder);
    }

    private User createCustomer() {
        Account checking = new Account(
                12345,
                AccountType.CHECKING);

        Account savings = new Account(
                67890,
                AccountType.SAVINGS);

        return new User(
                "rohit",
                "hashed-password",
                "customer",
                checking,
                savings);
    }

    @Test
    void depositShouldIncreaseCheckingBalance() {
            // Arrange
            User customer = createCustomer();

            when(userRepository.findByUsername("rohit"))
                            .thenReturn(Optional.of(customer));

            when(userRepository.save(any(User.class)))
                            .thenAnswer(invocation -> invocation.getArgument(0));

            // Act
            User result = customerService.deposit(
                            "rohit",
                            AccountType.CHECKING,
                            new BigDecimal("100.00"));

            // Assert
            assertEquals(
                            new BigDecimal("100.00"),
                            result.getCheckingAccount().getBalance());

            verify(userRepository).save(customer);
    }

    @Test
    void depositShouldRejectZeroAmount() {
            IllegalArgumentException exception = org.junit.jupiter.api.Assertions.assertThrows(
                            IllegalArgumentException.class,
                            () -> customerService.deposit(
                                            "rohit",
                                            AccountType.CHECKING,
                                            BigDecimal.ZERO));

            assertEquals(
                            "Amount must be greater than zero",
                            exception.getMessage());
    }
}