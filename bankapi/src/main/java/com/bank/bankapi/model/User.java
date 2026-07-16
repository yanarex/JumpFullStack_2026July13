package com.bank.bankapi.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Document(collection = "users")
public class User {

    @Id
    @JsonIgnore
    private String mongoId;

    @Indexed(unique = true)
    private String username;

    @JsonIgnore
    private String passwordHash;

    private UserType userType;

    private Account checkingAccount;
    private Account savingsAccount;

    public User() {
        // Required by Spring Data MongoDB
    }

    public User(
            String username,
            String passwordHash,
            UserType userType,
            Account checkingAccount,
            Account savingsAccount) {

        this.username = username;
        this.passwordHash = passwordHash;
        this.userType = userType;
        this.checkingAccount = checkingAccount;
        this.savingsAccount = savingsAccount;
    }

    public String getMongoId() {
        return mongoId;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public UserType getUserType() {
        return userType;
    }

    public Account getCheckingAccount() {
        return checkingAccount;
    }

    public Account getSavingsAccount() {
        return savingsAccount;
    }

    public void setMongoId(String mongoId) {
        this.mongoId = mongoId;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public void setCheckingAccount(Account checkingAccount) {
        this.checkingAccount = checkingAccount;
    }

    public void setSavingsAccount(Account savingsAccount) {
        this.savingsAccount = savingsAccount;
    }
}