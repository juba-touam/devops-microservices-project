package com.example.catalogue.repository;

import com.example.catalogue.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findById(int id);
}
