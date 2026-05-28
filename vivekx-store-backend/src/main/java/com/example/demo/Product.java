package com.example.demo;
import java.util.Set;
import java.util.LinkedHashSet;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "product")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String slug;

    private String name;

    /* original price */
    private double price;

    /* discount price */
    private Double discountPrice;

    /* stock quantity */
    private int stock = 10;

    private String category;

    /* active / hidden */
    private boolean active = true;

    /* main image */
    @Column(name = "image_url")
    private String imageUrl;

    /* multiple images */
   

    /* product description */
    @Column(length = 2000)
    private String description;

    /* product variants */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference
    private Set<ProductImage> images = new LinkedHashSet<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JsonManagedReference(value="product-size")
    private Set<ProductSize> sizes = new LinkedHashSet<>();

    @JsonManagedReference(value="product-color")
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<ProductColor> colors = new LinkedHashSet<>();

   

    @ManyToOne
    private ProductCollection collection;
    @Column(unique = true)
    private String productCode;

    private Integer editionNumber;

    private String rarityLevel;

    private boolean collectible = true;

    private boolean activated = false;
    // ========================
    // GETTERS & SETTERS
    // ========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Double getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(Double discountPrice) {
        this.discountPrice = discountPrice;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }



    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<ProductImage> getImages() {
        return images;
    }

    public void setImages(Set<ProductImage> images) {
        this.images = images;
    }

    public Set<ProductSize> getSizes() {
        return sizes;
    }

    public void setSizes(Set<ProductSize> sizes) {
        this.sizes = sizes;
    }

    public Set<ProductColor> getColors() {
        return colors;
    }

    public void setColors(Set<ProductColor> colors) {
        this.colors = colors;
    }
    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public Integer getEditionNumber() {
        return editionNumber;
    }

    public void setEditionNumber(Integer editionNumber) {
        this.editionNumber = editionNumber;
    }

    public String getRarityLevel() {
        return rarityLevel;
    }

    public void setRarityLevel(String rarityLevel) {
        this.rarityLevel = rarityLevel;
    }

    public boolean isCollectible() {
        return collectible;
    }

    public void setCollectible(boolean collectible) {
        this.collectible = collectible;
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public ProductCollection getCollection() {
        return collection;
    }

    public void setCollection(ProductCollection collection) {
        this.collection = collection;
    }

}