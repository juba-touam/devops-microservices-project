package com.example.catalogue;

import com.example.catalogue.model.Product;
import com.example.catalogue.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;

    public DataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            productRepository.save(new Product(1, "Laptop", "Electronics", 999.99, 50, "/images/laptop.svg"));
            productRepository.save(new Product(2, "Phone", "Electronics", 699.99, 120, "/images/phone.svg"));
            productRepository.save(new Product(3, "Tablet", "Electronics", 449.99, 80, "/images/tablet.svg"));
            productRepository.save(new Product(4, "Headphones", "Accessories", 149.99, 200, "/images/headphones.svg"));
            System.out.println("Catalogue initialized with 4 products");
        }
    }
}
