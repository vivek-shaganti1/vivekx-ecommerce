package com.example.demo;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ─────────────────────────────
    // REGISTER
    // ─────────────────────────────
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return badRequest("Email is required");
        }

        if (userRepo.findByEmail(request.getEmail().trim()).isPresent()) {
            return badRequest("An account with this email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        userRepo.save(user);

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", "Registration successful. Please log in.");
        return ResponseEntity.ok(body);
    }

    // ─────────────────────────────
    // LOGIN
    // ─────────────────────────────
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return badRequest("Email is required");
        }

        User user = userRepo.findByEmail(request.getEmail().trim().toLowerCase())
                .orElse(null);

        if (user == null) {
            // Use same message for security (don't reveal whether email exists)
            return badRequest("Invalid email or password");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return badRequest("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        LoginResponse loginResponse = new LoginResponse(
                user.getId(),
                user.getName(),
                user.getRole(),
                token
        );

        // Return structured JSON wrapper so frontend always gets consistent shape
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("id", loginResponse.getId());
        body.put("name", loginResponse.getName());
        body.put("role", loginResponse.getRole());
        body.put("token", loginResponse.getToken());

        return ResponseEntity.ok(body);
    }

    // ─────────────────────────────
    // Helper
    // ─────────────────────────────
    private ResponseEntity<Map<String, Object>> badRequest(String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("message", message);
        return ResponseEntity.badRequest().body(body);
    }
}