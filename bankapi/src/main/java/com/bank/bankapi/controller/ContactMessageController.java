package com.bank.bankapi.controller;

import com.bank.bankapi.dto.ContactMessageRequest;
import com.bank.bankapi.model.ContactMessage;
import com.bank.bankapi.repository.ContactMessageRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact-messages")
public class ContactMessageController {

    private final ContactMessageRepository contactMessageRepository;

    public ContactMessageController(
            ContactMessageRepository contactMessageRepository) {

        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping
    public ResponseEntity<?> createMessage(
            @RequestBody ContactMessageRequest request) {

        if (request.getFullName() == null
                || request.getFullName().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Full name is required");
        }

        if (request.getEmail() == null
                || request.getEmail().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (request.getMessage() == null
                || request.getMessage().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Message is required");
        }

        ContactMessage contactMessage = new ContactMessage(
                request.getFullName().trim(),
                request.getEmail().trim(),
                request.getMessage().trim());

        ContactMessage savedMessage = contactMessageRepository.save(
                contactMessage);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedMessage);
    }
}