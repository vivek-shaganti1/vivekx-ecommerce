package com.example.demo.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            String authHeader = request.getHeader("Authorization");

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                String token = authHeader.substring(7).trim();

                if (!token.isEmpty() && jwtUtil.validateToken(token)) {

                    String email = jwtUtil.extractEmail(token);
                    String role  = jwtUtil.extractRole(token);

                    // Normalize role: strip any accidental "ROLE_" prefix before we re-add it
                    String normalizedRole = (role != null)
                            ? role.toUpperCase().replace("ROLE_", "")
                            : "USER";

                    UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(() -> "ROLE_" + normalizedRole)
                        );

                    auth.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);

                } else if (!token.isEmpty()) {
                    System.err.println("[JwtAuthFilter] Invalid/expired token for: " + request.getRequestURI());
                }
            }

            // Always continue — Spring Security handles authorization (401/403) downstream
            filterChain.doFilter(request, response);

        } catch (Exception ex) {

            // Safety net: if ANYTHING blows up inside the filter, return clean JSON
            System.err.println("[JwtAuthFilter] Unexpected exception: " + ex.getClass().getName() + " — " + ex.getMessage());
            ex.printStackTrace();

            if (!response.isCommitted()) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");

                Map<String, Object> body = new LinkedHashMap<>();
                body.put("status", 500);
                body.put("error", "Internal Server Error");
                body.put("message", "Auth filter error. Check server logs.");

                objectMapper.writeValue(response.getOutputStream(), body);
            }
        }
    }
}