package com.example.demo.dto;

import java.util.Set;
import java.util.LinkedHashSet;
import java.util.stream.Collectors;
import com.example.demo.Product;
import com.example.demo.ProductImage;
import com.example.demo.ProductSize;
import com.example.demo.ProductColor;

public class ProductDTO {

    private Long id;
    private String slug;
    private String name;
    private double price;
    private Double discountPrice;
    private int stock;
    private String category;
    private boolean active;
    private String imageUrl;
    private String description;
    private String productCode;
    private Integer editionNumber;
    private String rarityLevel;
    private boolean collectible;
    private boolean activated;
    private Set<ProductImageDTO> images = new LinkedHashSet<>();
    private Set<ProductSizeDTO> sizes = new LinkedHashSet<>();
    private Set<ProductColorDTO> colors = new LinkedHashSet<>();

    public static class ProductImageDTO {
        private Long id;
        private String image;

        public ProductImageDTO() {}
        public ProductImageDTO(ProductImage img) {
            this.id = img.getId();
            this.image = img.getImage();
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }

    public static class ProductSizeDTO {
        private Long id;
        private String size;

        public ProductSizeDTO() {}
        public ProductSizeDTO(ProductSize s) {
            this.id = s.getId();
            this.size = s.getSize();
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }
    }

    public static class ProductColorDTO {
        private Long id;
        private String color;

        public ProductColorDTO() {}
        public ProductColorDTO(ProductColor c) {
            this.id = c.getId();
            this.color = c.getColor();
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }

    public ProductDTO() {}

    public ProductDTO(Product product) {
        this.id = product.getId();
        this.slug = product.getSlug();
        this.name = product.getName();
        this.price = product.getPrice();
        this.discountPrice = product.getDiscountPrice();
        this.stock = product.getStock();
        this.category = product.getCategory();
        this.active = product.isActive();
        this.imageUrl = product.getImageUrl();
        this.description = product.getDescription();
        this.productCode = product.getProductCode();
        this.editionNumber = product.getEditionNumber();
        this.rarityLevel = product.getRarityLevel();
        this.collectible = product.isCollectible();
        this.activated = product.isActivated();
        if (product.getImages() != null) {
            this.images = product.getImages().stream()
                .map(ProductImageDTO::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        }
        if (product.getSizes() != null) {
            this.sizes = product.getSizes().stream()
                .map(ProductSizeDTO::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        }
        if (product.getColors() != null) {
            this.colors = product.getColors().stream()
                .map(ProductColorDTO::new)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        }
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public Double getDiscountPrice() { return discountPrice; }
    public void setDiscountPrice(Double discountPrice) { this.discountPrice = discountPrice; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    public Integer getEditionNumber() { return editionNumber; }
    public void setEditionNumber(Integer editionNumber) { this.editionNumber = editionNumber; }
    public String getRarityLevel() { return rarityLevel; }
    public void setRarityLevel(String rarityLevel) { this.rarityLevel = rarityLevel; }
    public boolean isCollectible() { return collectible; }
    public void setCollectible(boolean collectible) { this.collectible = collectible; }
    public boolean isActivated() { return activated; }
    public void setActivated(boolean activated) { this.activated = activated; }
    public Set<ProductImageDTO> getImages() { return images; }
    public void setImages(Set<ProductImageDTO> images) { this.images = images; }
    public Set<ProductSizeDTO> getSizes() { return sizes; }
    public void setSizes(Set<ProductSizeDTO> sizes) { this.sizes = sizes; }
    public Set<ProductColorDTO> getColors() { return colors; }
    public void setColors(Set<ProductColorDTO> colors) { this.colors = colors; }
}
