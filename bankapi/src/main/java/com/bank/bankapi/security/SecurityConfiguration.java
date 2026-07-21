package com.bank.bankapi.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfiguration {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final AuthenticationProvider authenticationProvider;

        public SecurityConfiguration(
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        AuthenticationProvider authenticationProvider) {

                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.authenticationProvider = authenticationProvider;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                HttpSecurity http) throws Exception {

                http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> {})
                .authorizeHttpRequests(auth -> auth

                // Public status endpoints.
                .requestMatchers("/", "/api/health", "/error")
                .permitAll()

                // Login and other authentication endpoints are public.
                .requestMatchers("/api/auth/**")
                .permitAll()

                // Anyone can create a normal customer.
                .requestMatchers(HttpMethod.POST, "/api/customers")
                .permitAll()

                // Anyone can contact an admin.
                .requestMatchers(HttpMethod.POST,"/api/contact-messages")
                .permitAll()

                // Only admins can access admin endpoints.
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

                // All other banking endpoints require login.
                .anyRequest()
                .authenticated())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}