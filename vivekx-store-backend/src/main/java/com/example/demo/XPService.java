package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class XPService {

    @Autowired
    private UserProfileRepository profileRepo;

    @Autowired
    private XPTransactionRepository xpRepo;

    public void addXP(Long userId,
                      int xp,
                      String reason){

        UserProfile profile =
                profileRepo
                .findByUserId(userId)
                .orElseGet(() -> {

                    UserProfile p =
                            new UserProfile();

                    p.setUserId(userId);

                    /* premium member ID */
                    p.setVivekxId(
                            "VX#" +
                            String.format("%04d", userId)
                    );

                    p.setTier("CORE");

                    p.setXp(0);

                    p.setTotalPurchases(0);

                    return p;

                });

        /* add XP */
        int newXP =
                profile.getXp() + xp;

        profile.setXp(newXP);

        /* calculate tier automatically */
        profile.setTier(
                calculateTier(newXP)
        );

        profileRepo.save(profile);

        /* log transaction */
        XPTransaction log =
                new XPTransaction();

        log.setUserId(userId);

        log.setXp(xp);

        log.setReason(reason);

        xpRepo.save(log);

    }


    private String calculateTier(int xp){

        if(xp >= 7000)
            return "OBSIDIAN";

        if(xp >= 3000)
            return "BLACK";

        if(xp >= 1500)
            return "GOLD";

        if(xp >= 500)
            return "SILVER";

        return "CORE";
    }

}