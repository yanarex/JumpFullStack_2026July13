package com.bank.bankapi.dto;

import java.math.BigDecimal;

import com.bank.bankapi.model.AccountType;

public class TransferRequest {

    private String fromUsername;
    private String toUsername;
    private AccountType fromAccountType;
    private AccountType toAccountType;
    private BigDecimal amount;

    public TransferRequest() {
    }

    public String getFromUsername() {
        return fromUsername;
    }

    public void setFromUsername(String fromUsername) {
        this.fromUsername = fromUsername;
    }

    public String getToUsername() {
        return toUsername;
    }

    public void setToUsername(String toUsername) {
        this.toUsername = toUsername;
    }

    public AccountType getFromAccountType() {
        return fromAccountType;
    }

    public void setFromAccountType(AccountType fromAccountType) {
        this.fromAccountType = fromAccountType;
    }

    public AccountType getToAccountType() {
        return toAccountType;
    }

    public void setToAccountType(AccountType toAccountType) {
        this.toAccountType = toAccountType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}