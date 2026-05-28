package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
        org.springframework.security.access.AccessDeniedException.class,
        org.springframework.security.core.AuthenticationException.class
    })
    public void handleSecurityExceptions(Exception ex) throws Exception {
        throw ex; // Let Spring Security handle access denied / authentication errors
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        System.err.println("--- GLOBAL EXCEPTION CAUGHT ---");
        ex.printStackTrace(); // 🔥 Print stack trace to console/Render logs for debugging
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Bad Request");
        response.put("message", ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred");
        response.put("status", HttpStatus.BAD_REQUEST.value());
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }
}