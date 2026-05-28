package com.example.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Catches ALL errors that reach the /error endpoint (Tomcat default error path),
 * including errors from filters and errors not handled by @RestControllerAdvice.
 * Returns clean JSON instead of Spring's "Whitelabel Error Page" HTML.
 * This is the last safety net to prevent "Unexpected token '<'" or plain text errors.
 */
@RestController
@RequestMapping("/error")
public class CustomErrorController implements ErrorController {

    private final DefaultErrorAttributes errorAttributes = new DefaultErrorAttributes();

    @RequestMapping
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {

        WebRequest webRequest = new ServletWebRequest(request);

        Map<String, Object> attrs = errorAttributes.getErrorAttributes(
                webRequest,
                ErrorAttributeOptions.of(
                        ErrorAttributeOptions.Include.EXCEPTION,
                        ErrorAttributeOptions.Include.MESSAGE
                )
        );

        Integer statusCode = (Integer) attrs.getOrDefault("status", 500);
        String errorMsg = (String) attrs.getOrDefault("error", "Internal Server Error");
        String message = (String) attrs.getOrDefault("message", "An unexpected error occurred");
        String path = (String) attrs.getOrDefault("path", request.getRequestURI());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", statusCode);
        body.put("error", errorMsg);
        body.put("message", message != null && !message.isBlank() ? message : errorMsg);
        body.put("path", path);

        HttpStatus status;
        try {
            status = HttpStatus.valueOf(statusCode);
        } catch (Exception e) {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return ResponseEntity.status(status).body(body);
    }
}
