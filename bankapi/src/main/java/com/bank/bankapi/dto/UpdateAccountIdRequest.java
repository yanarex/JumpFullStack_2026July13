package com.bank.bankapi.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class UpdateAccountIdRequest {

    @Min(value = 10000, message = "Account ID must contain five digits")
    @Max(value = 99999, message = "Account ID must contain five digits")
    private int newId;

    public int getNewId() {
        return newId;
    }

    public void setNewId(int newId) {
        this.newId = newId;
    }
}