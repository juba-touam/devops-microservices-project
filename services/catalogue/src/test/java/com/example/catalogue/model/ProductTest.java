package com.example.catalogue.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void noArgConstructor_createsInstance() {
        Product product = new Product();
        assertNotNull(product);
    }

    @Test
    void allArgConstructor_setsFields() {
        Product product = new Product(1, "Laptop", "Electronics", 999.99, 50, "/images/laptop.svg");
        assertEquals(1, product.getId());
        assertEquals("Laptop", product.getName());
        assertEquals("Electronics", product.getCategory());
        assertEquals(999.99, product.getPrice());
        assertEquals(50, product.getStock());
        assertEquals("/images/laptop.svg", product.getImage());
    }

    @Test
    void settersAndGetters() {
        Product product = new Product();
        product.setMongoId("mongo-123");
        product.setId(42);
        product.setName("Phone");
        product.setCategory("Electronics");
        product.setPrice(699.99);
        product.setStock(120);
        product.setImage("/images/phone.svg");

        assertEquals("mongo-123", product.getMongoId());
        assertEquals(42, product.getId());
        assertEquals("Phone", product.getName());
        assertEquals("Electronics", product.getCategory());
        assertEquals(699.99, product.getPrice());
        assertEquals(120, product.getStock());
        assertEquals("/images/phone.svg", product.getImage());
    }
}
