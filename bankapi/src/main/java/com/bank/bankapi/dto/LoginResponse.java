package com.bank.bankapi.dto;

import com.bank.bankapi.model.UserType;

public class LoginResponse {

    private boolean success;
    private String message;
    private String username;
    private UserType userType;

    public LoginResponse(
            boolean success,
            String message,
            String username,
            UserType userType) {

        this.success = success;
        this.message = message;
        this.username = username;
        this.userType = userType;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public String getUsername() {
        return username;
    }

    public UserType getUserType() {
        return userType;
    }
}