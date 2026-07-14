package com.bank.bankapi.dto;

import java.math.BigDecimal;

import com.bank.bankapi.model.AccountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class TransferRequest {

    @NotNull(message = "Account type is required")
    private AccountType fromAccount;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    public AccountType getFromAccount() {
        return fromAccount;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setFromAccount(AccountType fromAccount) {
        this.fromAccount = fromAccount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}