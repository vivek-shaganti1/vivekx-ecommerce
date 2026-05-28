package com.example.demo;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import jakarta.persistence.EntityNotFoundException;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Global exception handler for all exceptions thrown within Spring MVC controllers.
 * Note: Exceptions in servlet filters (like JwtAuthFilter) are NOT caught here —
 * those are handled directly in the filter or by CustomErrorController.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ──────────────────────────────────────────────────────────────────────
    // 401 Unauthorized
    // ──────────────────────────────────────────────────────────────────────
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthException(AuthenticationException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Unauthorized", ex.getMessage());
    }

    // ──────────────────────────────────────────────────────────────────────
    // 403 Forbidden
    // ──────────────────────────────────────────────────────────────────────
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDenied(AccessDeniedException ex) {
        return buildResponse(HttpStatus.FORBIDDEN, "Forbidden", "You do not have permission to access this resource.");
    }

    // ──────────────────────────────────────────────────────────────────────
    // 404 Not Found
    // ──────────────────────────────────────────────────────────────────────
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(EntityNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
    }

    // ──────────────────────────────────────────────────────────────────────
    // 400 Bad Request (validation)
    // ──────────────────────────────────────────────────────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .findFirst()
                .orElse("Validation error");
        return buildResponse(HttpStatus.BAD_REQUEST, "Validation Failed", msg);
    }

    // ──────────────────────────────────────────────────────────────────────
    // 400 Catch-all (RuntimeException, DB errors, etc.)
    // ──────────────────────────────────────────────────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleAllExceptions(Exception ex) {
        System.err.println("--- [GlobalExceptionHandler] Caught: " + ex.getClass().getName());
        ex.printStackTrace();

        String message = ex.getMessage();
        if (message == null || message.isBlank()) {
            message = "An unexpected server error occurred.";
        }

        return buildResponse(HttpStatus.BAD_REQUEST, "Bad Request", message);
    }

    // ──────────────────────────────────────────────────────────────────────
    // Helper
    // ──────────────────────────────────────────────────────────────────────
    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String error, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}