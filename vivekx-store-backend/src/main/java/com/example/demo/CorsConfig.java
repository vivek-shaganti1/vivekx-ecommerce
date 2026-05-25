package com.example.demo;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);

        // ✅ ALLOWED ORIGINS (ADD LIVE FRONTEND HERE)
        config.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "https://*.netlify.app",
            "https://*.vercel.app"
        ));

        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        // Important for JWT
        config.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}