import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogueService } from '../../services/catalogue.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogue.component.html'
})
export class CatalogueComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = false;
  toastMessage = '';
  toastVisible = false;

  constructor(
    private readonly catalogueService: CatalogueService,
    private readonly cartService: CartService
  ) {}

  ngOnInit(): void {
    this.catalogueService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  getCartQty(productId: number): number {
    return this.cartService.getCartItemQty(productId);
  }

  canAdd(product: Product): boolean {
    return product.stock > this.getCartQty(product.id);
  }

  addToCart(product: Product): void {
    if (this.cartService.addItem(product.id, product.name, product.price, product.stock)) {
      this.showToast(product.name + ' ajout\u00e9 au panier');
    }
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    this.toastVisible = true;
    setTimeout(() => this.toastVisible = false, 2000);
  }
}
