package com.bank.bankapi.controller;

import com.bank.bankapi.dto.AuthenticationResponse;
import com.bank.bankapi.dto.LoginRequest;
import com.bank.bankapi.model.User;
import com.bank.bankapi.model.UserType;
import com.bank.bankapi.repository.UserRepository;
import com.bank.bankapi.security.JwtService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;

    public AuthenticationController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody LoginRequest request) {
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

        User user = new User();

        user.setUsername(request.getUsername());

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()));

        user.setUserType(UserType.CUSTOMER);

        /*
         * Add your existing account initialization here.
         *
         * Examples:
         * user.setCheckingBalance(BigDecimal.ZERO);
         * user.setSavingsBalance(BigDecimal.ZERO);
         * user.setTransactions(new ArrayList<>());
         */

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Customer account created");
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @RequestBody LoginRequest request) {
            try {authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()));
                } catch (Exception e) {
                        return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body("Incorrect username or password");
            }
        UserDetails userDetails = userDetailsService.loadUserByUsername(
                request.getUsername());

        String token = jwtService.generateToken(userDetails);

        User bankUser = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow();

        AuthenticationResponse response = new AuthenticationResponse(
                token,
                bankUser.getUsername(),
                bankUser.getUserType());

        return ResponseEntity.ok(response);
    }
}