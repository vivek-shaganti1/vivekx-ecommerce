package com.example.demo;

import com.example.demo.security.JwtAuthFilter;
import com.example.demo.security.JsonAuthEntryPoint;
import com.example.demo.security.JsonAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final JsonAuthEntryPoint jsonAuthEntryPoint;
    private final JsonAccessDeniedHandler jsonAccessDeniedHandler;

    public SecurityConfig(
            JwtAuthFilter jwtAuthFilter,
            JsonAuthEntryPoint jsonAuthEntryPoint,
            JsonAccessDeniedHandler jsonAccessDeniedHandler
    ) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.jsonAuthEntryPoint = jsonAuthEntryPoint;
        this.jsonAccessDeniedHandler = jsonAccessDeniedHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // ✅ Wire custom JSON error handlers
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jsonAuthEntryPoint)    // 401 → JSON
                .accessDeniedHandler(jsonAccessDeniedHandler)    // 403 → JSON
            )

            .authorizeHttpRequests(auth -> auth

                // Always permit the error endpoint (CustomErrorController)
                .requestMatchers("/error").permitAll()

                // PUBLIC APIs
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/users/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                // 🔐 CART requires login
                .requestMatchers("/api/cart/**").authenticated()

                // 🔐 ADMIN product mutation routes
                .requestMatchers(HttpMethod.POST,   "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                // everything else requires auth
                .anyRequest().authenticated()
            )

            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {

        org.springframework.web.cors.CorsConfiguration configuration =
                new org.springframework.web.cors.CorsConfiguration();

        // Allow both the primary Vercel URL and any preview deploy URLs
        configuration.setAllowedOriginPatterns(java.util.List.of(
                "https://vivekx-ecommerce.vercel.app",
                "https://*.vercel.app",
                "http://localhost:5173",
                "http://localhost:3000"
        ));

        configuration.setAllowedMethods(java.util.List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        configuration.setAllowedHeaders(java.util.List.of("*"));
        configuration.setAllowCredentials(true);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}