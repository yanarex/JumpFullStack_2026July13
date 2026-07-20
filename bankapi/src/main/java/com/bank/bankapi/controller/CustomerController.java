package com.bank.bankapi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import com.bank.bankapi.dto.AmountRequest;
import com.bank.bankapi.dto.CreateCustomerRequest;
import com.bank.bankapi.dto.ExternalTransferRequest;
import com.bank.bankapi.model.Transaction;
import com.bank.bankapi.dto.UpdateAccountIdRequest;
import com.bank.bankapi.model.AccountType;
import com.bank.bankapi.model.User;
import com.bank.bankapi.service.CustomerService;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

        private final CustomerService customerService;

        public CustomerController(CustomerService customerService) {
                this.customerService = customerService;
        }

        /*
         * Creates a new customer.
         *
         * POST /api/customers
         */
        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public User createCustomer(
                        @Valid @RequestBody CreateCustomerRequest request) {

                return customerService.createCustomer(
                                request.getUsername(),
                                request.getPassword());
        }

        /*
         * Returns every customer.
         * Admin users are filtered out by CustomerService.
         *
         * GET /api/customers
         */
        @GetMapping
        public List<User> getAllCustomers() {
                return customerService.getAllCustomers();
        }

        /*
         * Returns one customer by username.
         *
         * GET /api/customers/{username}
         */
        @GetMapping("/{username}")
        public User getCustomer(
                        @PathVariable String username) {

                return customerService.getCustomer(username);
        }

        /*
         * Deletes a customer by username.
         *
         * CustomerService verifies that the selected user
         * is a customer, so this cannot delete an admin.
         *
         * DELETE /api/customers/{username}
         */
        @DeleteMapping("/{username}")
        public Map<String, String> deleteCustomer(
                        @PathVariable String username) {

                customerService.deleteCustomer(username);

                return Map.of(
                                "message",
                                "Customer deleted successfully",
                                "username",
                                username);
        }

        /*
         * Deposits money into one of a customer's accounts.
         *
         * POST /api/customers/{username}/accounts/{accountType}/deposit
         */
        @PostMapping("/{username}/accounts/{accountType}/deposit")
        public User deposit(
                        @PathVariable String username,
                        @PathVariable AccountType accountType,
                        @Valid @RequestBody AmountRequest request) {

                return customerService.deposit(
                                username,
                                accountType,
                                request.getAmount());
        }

        /*
         * Withdraws money from one of a customer's accounts.
         *
         * POST /api/customers/{username}/accounts/{accountType}/withdraw
         */
        @PostMapping("/{username}/accounts/{accountType}/withdraw")
        public User withdraw(
                        @PathVariable String username,
                        @PathVariable AccountType accountType,
                        @Valid @RequestBody AmountRequest request) {

                return customerService.withdraw(
                                username,
                                accountType,
                                request.getAmount());
        }

        /*
         * Transfers money between the same customer's
         * checking and savings accounts.
         *
         * This is your original transfer endpoint.
         *
         * POST /api/customers/{username}/transfer
         */
        @PostMapping("/{username}/transfer")
        public User transfer(
                        @PathVariable String username,
                        @Valid @RequestBody ExternalTransferRequest request) {

                return customerService.transfer(
                                username,
                                request.getFromAccountType(),
                                request.getAmount());
        }

        /*
         * Transfers money from one customer's account
         * to another customer's account.
         *
         * The customers are found using their usernames.
         *
         * POST /api/customers/transfer-between-customers
         */
        @PostMapping("/{username}/transfer-to-customer")
        public User transferToCustomer(
                @PathVariable String username,
                @Valid @RequestBody ExternalTransferRequest request) {

        return customerService.transferToAnotherCustomer(
                username,
                request
        );
        }
        /*
         * Updates the generated ID of an account.
         *
         * PATCH /api/customers/{username}/accounts/{accountType}/id
         */
        @PatchMapping("/{username}/accounts/{accountType}/id")
        public User updateAccountId(
                        @PathVariable String username,
                        @PathVariable AccountType accountType,
                        @Valid @RequestBody UpdateAccountIdRequest request) {

                return customerService.updateAccountId(
                                username,
                                accountType,
                                request.getNewId());
        }
        
        @GetMapping("/{username}/transactions")
        public ResponseEntity<List<Transaction>> getTransactions(
        @PathVariable String username) {

        return ResponseEntity.ok(
                customerService.getTransactions(username));
        }
        
        @PostMapping("/{username}/external-transfer")
        public ResponseEntity<User> externalTransfer(
                        @PathVariable String username,
                        @RequestBody ExternalTransferRequest request) {

                return ResponseEntity.ok(
                                customerService.transferToAnotherCustomer(
                                                username,
                                                request));
        }
}