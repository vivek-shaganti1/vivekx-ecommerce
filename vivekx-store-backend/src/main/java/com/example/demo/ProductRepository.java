package com.example.demo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // find by slug (ProductDetails page)
    Optional<Product> findBySlug(String slug);
    
    Optional<Product> findByProductCode(String code);
    // category filter (future use)
    List<Product> findByCategory(String category);

    // show only active products (soft delete support)
    List<Product> findByActiveTrue();

}