package com.example.catalogue.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
class ProductControllerIntegrationTest {

    @Container
    static MongoDBContainer mongoDBContainer = new MongoDBContainer("mongo:7.0");

    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", mongoDBContainer::getReplicaSetUrl);
    }

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getCatalogue_returnsAllSeededProducts() throws Exception {
        mockMvc.perform(get("/api/catalogue"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(4)))
                .andExpect(jsonPath("$[0].name", is("Laptop")))
                .andExpect(jsonPath("$[1].name", is("Phone")))
                .andExpect(jsonPath("$[2].name", is("Tablet")))
                .andExpect(jsonPath("$[3].name", is("Headphones")));
    }

    @Test
    void getCatalogueItem_existingId_returnsProduct() throws Exception {
        mockMvc.perform(get("/api/catalogue/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Laptop")))
                .andExpect(jsonPath("$.category", is("Electronics")))
                .andExpect(jsonPath("$.price", is(999.99)));
    }

    @Test
    void getCatalogueItem_nonExistingId_returnsError() throws Exception {
        mockMvc.perform(get("/api/catalogue/999"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.error", is("Item not found")));
    }
}
