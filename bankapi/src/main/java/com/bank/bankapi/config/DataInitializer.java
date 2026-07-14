package com.bank.bankapi.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.bank.bankapi.config.AppConfig.PasswordEncoder;
import com.bank.bankapi.model.User;
import com.bank.bankapi.repository.UserRepository;

@Component
public class DataInitializer
        implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    passwordEncoder.encode("admin123"),
                    "admin",
                    null,
                    null);

            userRepository.save(admin);
        }
    }
}