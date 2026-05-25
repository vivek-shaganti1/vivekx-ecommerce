package com.example.demo;

import jakarta.persistence.*;

@Entity
public class UserProfile {

    @Id
    private Long userId;

    /* premium identity id */
    @Column(unique = true)
    private String vivekxId;

    private int xp = 0;

    private String tier = "MEMBER";

    private int totalPurchases = 0;

    // =====================
    // GETTERS & SETTERS
    // =====================

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getVivekxId() {
        return vivekxId;
    }

    public void setVivekxId(String vivekxId) {
        this.vivekxId = vivekxId;
    }

    public int getXp() {
        return xp;
    }

    public void setXp(int xp) {
        this.xp = xp;
    }

    public String getTier() {
        return tier;
    }

    public void setTier(String tier) {
        this.tier = tier;
    }

    public int getTotalPurchases() {
        return totalPurchases;
    }

    public void setTotalPurchases(int totalPurchases) {
        this.totalPurchases = totalPurchases;
    }
}