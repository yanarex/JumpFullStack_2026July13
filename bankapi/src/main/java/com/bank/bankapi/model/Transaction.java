package com.bank.bankapi.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;


public class Transaction {

    private String transactionId;
    private TransactionType type;
    private AccountType accountType;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private String otherUsername;
    private Integer otherAccountId;;
    private LocalDateTime createdAt;

    public Transaction() {
        this.transactionId = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
    }

    public Transaction(
            TransactionType type,
            AccountType accountType,
            BigDecimal amount,
            BigDecimal balanceAfter,
            String description,
            String otherUsername,
            Integer otherAccountId) {

        this();
        this.type = type;
        this.accountType = accountType;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.description = description;
        this.otherUsername = otherUsername;
        this.otherAccountId = otherAccountId;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public TransactionType getType() {
        return type;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getBalanceAfter() {
        return balanceAfter;
    }

    public String getDescription() {
        return description;
    }

    public String getOtherUsername() {
        return otherUsername;
    }

    public Integer getOtherAccountNumber() {
        return otherAccountId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setBalanceAfter(BigDecimal balanceAfter) {
        this.balanceAfter = balanceAfter;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setOtherUsername(String otherUsername) {
        this.otherUsername = otherUsername;
    }

    public void setOtherAccountNumber(Integer otherAccountNumber) {
        this.otherAccountId = otherAccountNumber;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}