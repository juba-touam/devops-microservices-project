package com.example.catalogue;

import com.example.catalogue.model.Product;
import com.example.catalogue.repository.ProductRepository;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

class DataInitializerTest {

    @Test
    void run_emptyDb_seedsFourProducts() {
        ProductRepository repo = mock(ProductRepository.class);
        when(repo.count()).thenReturn(0L);
        when(repo.save(any(Product.class))).thenAnswer(i -> i.getArgument(0));

        DataInitializer initializer = new DataInitializer(repo);
        initializer.run();

        verify(repo, times(4)).save(any(Product.class));
    }

    @Test
    void run_existingData_doesNotSeed() {
        ProductRepository repo = mock(ProductRepository.class);
        when(repo.count()).thenReturn(4L);

        DataInitializer initializer = new DataInitializer(repo);
        initializer.run();

        verify(repo, never()).save(any(Product.class));
    }
}
