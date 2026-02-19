package com.example.catalogue.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {

    @Id
    private String mongoId;
    private int id;
    private String name;
    private String category;
    private double price;
    private int stock;
    private String image;

    public Product() {}

    public Product(int id, String name, String category, double price, int stock, String image) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.image = image;
    }

    public String getMongoId() { return mongoId; }
    public void setMongoId(String mongoId) { this.mongoId = mongoId; }
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getStock() { return stock; }
    public void setStock(int stock) { this.stock = stock; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}
