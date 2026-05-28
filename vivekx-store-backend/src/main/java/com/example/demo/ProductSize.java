package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductSize {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String size;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference(value="product-size")
    private Product product;

    public Long getId() { return id; }
    public void setId(Long id) {
        this.id = id;
    }
    public String getSize() { return size; }

    public void setSize(String size) { this.size = size; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }
}