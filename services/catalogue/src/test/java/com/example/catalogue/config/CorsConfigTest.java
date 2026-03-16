package com.example.catalogue.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.lang.reflect.Field;

import static org.junit.jupiter.api.Assertions.*;

class CorsConfigTest {

    @Test
    void corsConfigurer_returnsWebMvcConfigurer() {
        CorsConfig config = new CorsConfig();
        WebMvcConfigurer configurer = config.corsConfigurer();
        assertNotNull(configurer);
    }

    @Test
    void corsConfigurer_addsCorsMapping() throws Exception {
        CorsConfig config = new CorsConfig();
        Field field = CorsConfig.class.getDeclaredField("allowedOrigins");
        field.setAccessible(true);
        field.set(config, new String[]{"http://localhost:4200"});

        WebMvcConfigurer configurer = config.corsConfigurer();
        CorsRegistry registry = new CorsRegistry();
        assertDoesNotThrow(() -> configurer.addCorsMappings(registry));
    }
}
