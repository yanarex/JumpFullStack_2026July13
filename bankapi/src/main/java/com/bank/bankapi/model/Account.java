package com.bank.bankapi.model;

import java.math.BigDecimal;

public class Account {

    private int id;
    private BigDecimal balance;
    private AccountType accountType;

    public Account() {
        
    }

    public Account(int id, AccountType accountType) {
        this.id = id;
        this.balance = BigDecimal.ZERO;
        this.accountType = accountType;
    }

    public int getId() {
        return id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }
}