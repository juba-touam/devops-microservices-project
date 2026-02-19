import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html'
})
export class PaymentComponent implements OnInit {
  loading = true;
  payment: PaymentResponse | null = null;
  success = false;
  error = false;

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const items = this.cartService.getItems();
    if (items.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    const total = this.cartService.getTotal();

    this.http.post<PaymentResponse>('/api/payment/payments', {
      amount: Math.round(total * 100) / 100,
      currency: 'EUR',
      description: 'Commande de ' + items.length + ' article(s)',
      items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity }))
    }).subscribe({
      next: (payment) => {
        this.payment = payment;
        this.success = payment.status === 'completed';
        this.loading = false;
        if (this.success) {
          this.cartService.clear();
        }
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  goToCatalogue(): void {
    this.router.navigate(['/']);
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }
}
