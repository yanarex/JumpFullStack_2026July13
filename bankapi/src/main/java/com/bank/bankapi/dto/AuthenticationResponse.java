package com.bank.bankapi.dto;

import com.bank.bankapi.model.UserType;

public class AuthenticationResponse {

    private String token;
    private String username;
    private UserType userType;

    public AuthenticationResponse(
            String token,
            String username,
            UserType userType) {
        this.token = token;
        this.username = username;
        this.userType = userType;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public UserType getUserType() {
        return userType;
    }
}