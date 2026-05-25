package com.example.demo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class ProductCollection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private String theme;

    private int totalItems;

    private LocalDateTime releaseDate;

    private boolean limitedEdition;

    // getters setters

    public Long getId() { return id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getTheme() { return theme; }

    public void setTheme(String theme) { this.theme = theme; }

    public int getTotalItems() { return totalItems; }

    public void setTotalItems(int totalItems) { this.totalItems = totalItems; }

    public LocalDateTime getReleaseDate() { return releaseDate; }

    public void setReleaseDate(LocalDateTime releaseDate) { this.releaseDate = releaseDate; }

    public boolean isLimitedEdition() { return limitedEdition; }

    public void setLimitedEdition(boolean limitedEdition) { this.limitedEdition = limitedEdition; }
}