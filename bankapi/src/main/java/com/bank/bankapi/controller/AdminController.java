package com.bank.bankapi.controller;

import com.bank.bankapi.dto.CreateAdminRequest;
import com.bank.bankapi.model.User;
import com.bank.bankapi.model.UserType;
import com.bank.bankapi.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @RequestBody CreateAdminRequest request) {
        if (request.getUsername() == null
                || request.getUsername().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Username is required");
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body("Password is required");
        }

        if (userRepository.existsByUsername(
                request.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body("Username already exists");
        }

        UserType selectedType = request.getUserType();

        if (selectedType == null) {
            selectedType = UserType.CUSTOMER;
        }

        User user = new User();

        user.setUsername(request.getUsername());

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()));

        user.setUserType(selectedType);

        /*
         * Add your existing checking account,
         * savings account and transaction initialization.
         */

        userRepository.save(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        "Created user with type: "
                                + selectedType);
    }
}