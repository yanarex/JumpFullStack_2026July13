package com.bank.bankapi.dto;

import java.math.BigDecimal;

import com.bank.bankapi.model.AccountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AdminTransferRequest {

    @NotBlank(message = "Source username is required")
    private String fromUsername;

    @NotBlank(message = "Destination username is required")
    private String toUsername;

    @NotNull(message = "Source account type is required")
    private AccountType fromAccount;

    @NotNull(message = "Destination account type is required")
    private AccountType toAccount;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    public AdminTransferRequest() {
    }

    public String getFromUsername() {
        return fromUsername;
    }

    public void setFromUsername(
            String fromUsername) {

        this.fromUsername = fromUsername;
    }

    public String getToUsername() {
        return toUsername;
    }

    public void setToUsername(
            String toUsername) {

        this.toUsername = toUsername;
    }

    public AccountType getFromAccount() {
        return fromAccount;
    }

    public void setFromAccount(
            AccountType fromAccount) {

        this.fromAccount = fromAccount;
    }

    public AccountType getToAccount() {
        return toAccount;
    }

    public void setToAccount(
            AccountType toAccount) {

        this.toAccount = toAccount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(
            BigDecimal amount) {

        this.amount = amount;
    }
}