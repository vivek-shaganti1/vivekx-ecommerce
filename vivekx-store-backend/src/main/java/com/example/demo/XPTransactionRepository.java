package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;   // ⭐ REQUIRED IMPORT

public interface XPTransactionRepository
        extends JpaRepository<XPTransaction, Long> {

    List<XPTransaction> findByUserId(Long userId);

}