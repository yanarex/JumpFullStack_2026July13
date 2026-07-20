package com.bank.bankapi.config;

import com.bank.bankapi.model.User;
import com.bank.bankapi.model.UserType;
import com.bank.bankapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer
        implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminUsername;
    private final String adminPassword;

    public AdminInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${bootstrap.admin.username:}") String adminUsername,
            @Value("${bootstrap.admin.password:}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(String... args) {
        if (adminUsername == null
                || adminUsername.isBlank()
                || adminPassword == null
                || adminPassword.isBlank()) {
            return;
        }

        if (userRepository.existsByUsername(
                adminUsername)) {
            return;
        }

        User admin = new User();

        admin.setUsername("admin");

        admin.setPasswordHash(
                passwordEncoder.encode("admin123"));

        admin.setUserType(UserType.ADMIN);

        /*
         * Initialize any required account fields here.
         */

        userRepository.save(admin);

        System.out.println(
                "Initial admin created: "
                        + adminUsername);
    }
}