package com.bank.bankapi.security;

import com.bank.bankapi.model.User;
import com.bank.bankapi.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BankUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public BankUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User bankUser = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found: " + username));

        if (bankUser.getUserType() == null) {
            throw new IllegalStateException(
                    "User does not have a user type: " + username);
        }

        String authority = "ROLE_" + bankUser.getUserType().name();

        return new org.springframework.security.core.userdetails.User(
                bankUser.getUsername(),
                bankUser.getPasswordHash(),
                List.of(new SimpleGrantedAuthority(authority)));
    }
}