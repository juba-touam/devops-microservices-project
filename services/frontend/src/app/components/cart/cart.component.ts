import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {
  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  get items(): CartItem[] {
    return this.cartService.getItems();
  }

  get total(): number {
    return this.cartService.getTotal();
  }

  changeQty(id: number, delta: number): void {
    this.cartService.changeQty(id, delta);
  }

  removeItem(id: number): void {
    this.cartService.removeItem(id);
  }

  goToCatalogue(): void {
    this.router.navigate(['/']);
  }

  processPayment(): void {
    this.router.navigate(['/payment']);
  }
}
