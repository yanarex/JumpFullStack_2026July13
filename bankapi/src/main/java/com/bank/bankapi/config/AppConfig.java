package com.bank.bankapi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

@Configuration
public class AppConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new SimplePasswordEncoder();
    }

    public interface PasswordEncoder {
        String encode(CharSequence rawPassword);
        boolean matches(CharSequence rawPassword, String encodedPassword);
    }

    private static class SimplePasswordEncoder implements PasswordEncoder {

        @Override
        public String encode(CharSequence rawPassword) {
            try {
                MessageDigest digest = MessageDigest.getInstance("SHA-256");
                byte[] hashed = digest.digest(rawPassword.toString().getBytes(StandardCharsets.UTF_8));
                return Base64.getEncoder().encodeToString(hashed);
            } catch (NoSuchAlgorithmException e) {
                throw new IllegalStateException("Unable to encode password", e);
            }
        }

        @Override
        public boolean matches(CharSequence rawPassword, String encodedPassword) {
            return encode(rawPassword).equals(encodedPassword);
        }
    }
}