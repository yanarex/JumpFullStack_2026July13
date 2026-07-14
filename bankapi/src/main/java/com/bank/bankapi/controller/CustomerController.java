package com.bank.bankapi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.bank.bankapi.dto.AmountRequest;
import com.bank.bankapi.dto.CreateCustomerRequest;
import com.bank.bankapi.dto.TransferRequest;
import com.bank.bankapi.dto.UpdateAccountIdRequest;
import com.bank.bankapi.model.AccountType;
import com.bank.bankapi.model.User;
import com.bank.bankapi.service.CustomerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(
            CustomerService customerService) {

        this.customerService = customerService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public User createCustomer(
            @Valid @RequestBody CreateCustomerRequest request) {

        return customerService.createCustomer(
                request.getUsername(),
                request.getPassword());
    }

    @GetMapping("/{username}")
    public User getCustomer(
            @PathVariable String username) {

        return customerService.getCustomer(username);
    }

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

    @PostMapping("/{username}/transfer")
    public User transfer(
            @PathVariable String username,
            @Valid @RequestBody TransferRequest request) {

        return customerService.transfer(
                username,
                request.getFromAccount(),
                request.getAmount());
    }

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
}