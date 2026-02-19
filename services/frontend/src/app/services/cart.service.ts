import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private itemsSubject = new BehaviorSubject<CartItem[]>([]);

  items$ = this.itemsSubject.asObservable();

  getItems(): CartItem[] {
    return this.items;
  }

  getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  addItem(id: number, name: string, price: number, maxStock: number): boolean {
    const existing = this.items.find(i => i.id === id);
    if (existing) {
      if (existing.quantity >= maxStock) return false;
      existing.quantity++;
    } else {
      this.items.push({ id, name, price, quantity: 1 });
    }
    this.itemsSubject.next([...this.items]);
    return true;
  }

  changeQty(id: number, delta: number): void {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => i.id !== id);
    }
    this.itemsSubject.next([...this.items]);
  }

  removeItem(id: number): void {
    this.items = this.items.filter(i => i.id !== id);
    this.itemsSubject.next([...this.items]);
  }

  clear(): void {
    this.items = [];
    this.itemsSubject.next([]);
  }

  getCartItemQty(id: number): number {
    const item = this.items.find(i => i.id === id);
    return item ? item.quantity : 0;
  }
}
