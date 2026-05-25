package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
//@CrossOrigin(origins = "http://localhost:5173")
public class UserRestController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private PasswordEncoder encoder;

    // =========================
    // REGISTER
    // =========================
    @PostMapping
    public User register(@RequestBody User user) {

        if (repo.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }

        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public User login(@RequestBody User user) {

    	User dbUser = repo.findByEmail(user.getEmail())
    	        .orElseThrow(() -> new RuntimeException("User not found"));

        if (dbUser == null) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!encoder.matches(user.getPassword(), dbUser.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        dbUser.setPassword(null); // hide password
        return dbUser;
    }

    // =========================
    // FORGOT PASSWORD (EMAIL CHECK)
    // =========================
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody User user) {

        if (repo.findByEmail(user.getEmail()) == null) {
            throw new RuntimeException("Email not registered");
        }

        return "Email verified";
    }

    // =========================
    // RESET PASSWORD
    // =========================
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody User user) {

    	User dbUser = repo.findByEmail(user.getEmail())
    	        .orElseThrow(() -> new RuntimeException("User not found"));

        if (dbUser == null) {
            throw new RuntimeException("User not found");
        }

        dbUser.setPassword(encoder.encode(user.getPassword()));
        repo.save(dbUser);

        return "Password updated successfully";
    }
}