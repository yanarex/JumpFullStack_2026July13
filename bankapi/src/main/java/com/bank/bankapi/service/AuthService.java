package com.bank.bankapi.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bank.bankapi.dto.LoginResponse;
import com.bank.bankapi.model.User;
import com.bank.bankapi.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse login(
            String username,
            String password) {

        User user = userRepository
                .findByUsername(username)
                .orElse(null);

        if (user == null ||
                !passwordEncoder.matches(
                        password,
                        user.getPasswordHash())) {

            return new LoginResponse(
                    false,
                    "Invalid credentials",
                    null,
                    null);
        }

        return new LoginResponse(
                true,
                "Login successful",
                user.getUsername(),
                user.getUserType());
    }
}