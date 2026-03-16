package com.example.catalogue.controller;

import com.example.catalogue.model.Product;
import com.example.catalogue.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductControllerTest {

    private ProductRepository productRepository;
    private ProductController controller;

    @BeforeEach
    void setUp() {
        productRepository = mock(ProductRepository.class);
        controller = new ProductController(productRepository);
    }

    @Test
    void health_returnsUpStatus() {
        Map<String, String> result = controller.health();
        assertEquals("UP", result.get("status"));
        assertEquals("catalogue", result.get("service"));
    }

    @Test
    void getCatalogue_returnsList() {
        Product p = new Product(1, "Laptop", "Electronics", 999.99, 50, "/images/laptop.svg");
        when(productRepository.findAll()).thenReturn(List.of(p));

        List<Product> result = controller.getCatalogue();
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getName());
    }

    @Test
    void getCatalogue_emptyList() {
        when(productRepository.findAll()).thenReturn(Collections.emptyList());

        List<Product> result = controller.getCatalogue();
        assertTrue(result.isEmpty());
    }

    @Test
    void getCatalogueItem_found() {
        Product p = new Product(1, "Laptop", "Electronics", 999.99, 50, "/images/laptop.svg");
        when(productRepository.findById(1)).thenReturn(Optional.of(p));

        ResponseEntity<?> result = controller.getCatalogueItem(1);
        assertEquals(200, result.getStatusCode().value());
        assertInstanceOf(Product.class, result.getBody());
        assertEquals("Laptop", ((Product) result.getBody()).getName());
    }

    @Test
    void getCatalogueItem_notFound() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        ResponseEntity<?> result = controller.getCatalogueItem(99);
        assertEquals(404, result.getStatusCode().value());
    }
}
