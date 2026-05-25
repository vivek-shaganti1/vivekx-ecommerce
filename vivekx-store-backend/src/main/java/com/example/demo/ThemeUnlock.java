package com.example.demo;

import jakarta.persistence.*;

@Entity
public class ThemeUnlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String themeName;

    private boolean active;

    // getters setters

    public Long getId() { return id; }

    public Long getUserId() { return userId; }

    public void setUserId(Long userId) { this.userId = userId; }

    public String getThemeName() { return themeName; }

    public void setThemeName(String themeName) { this.themeName = themeName; }

    public boolean isActive() { return active; }

    public void setActive(boolean active) { this.active = active; }
}