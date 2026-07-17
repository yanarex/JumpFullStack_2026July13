package com.bank.bankapi.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.bank.bankapi.model.User;

public interface UserRepository
        extends MongoRepository<User, String> {

                
        Optional<User> findByCheckingAccount_Id(String accountId);

        Optional<User> findBySavingsAccount_Id(String accountId);
        Optional<User> findByUsername(String username);

        boolean existsByUsername(String username);

        @Query("{ '$or': [ { 'checkingAccount.id': ?0 }, { 'savingsAccount.id': ?0 } ] }")
        Optional<User> findByAccountId(int accountId);
        
    @Query(value = "{ '$or': [ " +
            "{ 'checkingAccount.id': ?0 }, " +
            "{ 'savingsAccount.id': ?0 } " +
            "] }", exists = true)
    boolean accountIdExists(int accountId);
    
}