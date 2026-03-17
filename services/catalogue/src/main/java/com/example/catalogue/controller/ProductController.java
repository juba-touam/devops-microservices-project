package com.example.catalogue.controller;

import com.example.catalogue.model.Product;
import com.example.catalogue.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "catalogue");
    }

    @GetMapping("/catalogue")
    public List<Product> getCatalogue() {
        return productRepository.findAll();
    }

    @GetMapping("/catalogue/{id}")
    public ResponseEntity<?> getCatalogueItem(@PathVariable int id) {
        return productRepository.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
