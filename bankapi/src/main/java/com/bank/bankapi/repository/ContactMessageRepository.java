package com.bank.bankapi.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.bank.bankapi.model.ContactMessage;

public interface ContactMessageRepository
        extends MongoRepository<ContactMessage, String> {

    List<ContactMessage> findAllByOrderByCreatedAtDesc();
}