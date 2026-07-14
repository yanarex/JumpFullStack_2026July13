package com.bank.bankapi.dto;

public class LoginResponse {

    private boolean success;
    private String message;
    private String username;
    private String userType;

    public LoginResponse(
            boolean success,
            String message,
            String username,
            String userType) {

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

    public String getUserType() {
        return userType;
    }
}