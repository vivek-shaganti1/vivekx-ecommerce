package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/xp")
//@CrossOrigin(origins="http://localhost:5173")
public class XPController {

    @Autowired
    XPTransactionRepository xpRepo;

    @GetMapping("/{userId}")
    public int getXP(@PathVariable Long userId){

        return xpRepo
                .findByUserId(userId)
                .stream()
                .mapToInt(x -> x.getXp())
                .sum();

    }

}