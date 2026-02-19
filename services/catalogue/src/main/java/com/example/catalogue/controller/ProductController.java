package com.example.catalogue.controller;

import com.example.catalogue.model.Product;
import com.example.catalogue.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    public Object getCatalogueItem(@PathVariable int id) {
        Optional<Product> item = productRepository.findById(id);
        return item.<Object>map(p -> p).orElse(Map.of("error", "Item not found"));
    }
}
