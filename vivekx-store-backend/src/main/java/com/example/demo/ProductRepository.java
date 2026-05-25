package com.example.demo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // find by slug (ProductDetails page)
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"images", "sizes", "colors"})
    Optional<Product> findBySlug(String slug);
    
    @Override
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"images", "sizes", "colors"})
    Optional<Product> findById(Long id);
    
    Optional<Product> findByProductCode(String code);
    // category filter (future use)
    List<Product> findByCategory(String category);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"images", "sizes", "colors"})
    List<Product> findByActiveTrue();

}