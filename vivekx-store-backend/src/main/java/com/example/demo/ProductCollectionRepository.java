package com.example.demo;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCollectionRepository
        extends JpaRepository<ProductCollection,Long> {
}