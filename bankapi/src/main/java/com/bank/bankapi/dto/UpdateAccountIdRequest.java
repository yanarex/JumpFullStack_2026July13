package com.bank.bankapi.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class UpdateAccountIdRequest {

    @Min(value = 10000000, message = "Account ID must contain eight digits")
    @Max(value = 99999999, message = "Account ID must contain eight digits")
    private int newId;

    public int getNewId() {
        return newId;
    }

    public void setNewId(int newId) {
        this.newId = newId;
    }
}