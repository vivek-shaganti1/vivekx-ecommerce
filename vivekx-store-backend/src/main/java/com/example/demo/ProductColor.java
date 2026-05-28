package com.example.demo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductColor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String color;

    @JsonBackReference(value="product-color")
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    public Long getId() { return id; }
    public void setId(Long id) {
        this.id = id;
    }
    public String getColor() { return color; }

    public void setColor(String color) { this.color = color; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }
}