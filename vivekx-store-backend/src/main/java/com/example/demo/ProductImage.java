package com.example.demo;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String image;

    @ManyToOne
    @JoinColumn(name="product_id")
    @JsonBackReference
    private Product product;

    public Long getId() { return id; }
    public void setId(Long id) {
        this.id = id;
    }
    public String getImage() { return image; }

    public void setImage(String image) { this.image = image; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }
}