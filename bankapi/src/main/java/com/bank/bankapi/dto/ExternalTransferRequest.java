package com.bank.bankapi.dto;

import java.math.BigDecimal;

import com.bank.bankapi.model.AccountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class ExternalTransferRequest {

    @NotNull(message = "Source account type is required")
    private AccountType fromAccountType;

    private int destinationAccountId;

    @NotNull(message = "Amount is required")
    @DecimalMin(
        value = "0.01",
        message = "Amount must be greater than zero"
    )
    private BigDecimal amount;

    public AccountType getFromAccountType() {
        return fromAccountType;
    }

    public void setFromAccountType(
            AccountType fromAccountType) {
        this.fromAccountType = fromAccountType;
    }

    public int getDestinationAccountId() {
        return destinationAccountId;
    }

    public void setDestinationAccountId(
            int destinationAccountId) {
        this.destinationAccountId = destinationAccountId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}