package com.bank.bankapi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.bank.bankapi.model.User;
import com.bank.bankapi.service.CustomerService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final CustomerService customerService;

    public AdminController(
            CustomerService customerService) {

        this.customerService = customerService;
    }

    @GetMapping("/customers")
    public List<User> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @DeleteMapping("/customers/{username}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(
            @PathVariable String username) {

        customerService.deleteCustomer(username);
    }
}