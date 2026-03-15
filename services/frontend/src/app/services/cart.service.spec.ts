import { CartService } from './cart.service';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    service = new CartService();
  });

  // --- addItem ---
  it('should add a new item to the cart', () => {
    const result = service.addItem(1, 'Laptop', 999, 10);
    expect(result).toBe(true);
    expect(service.getItems()).toHaveLength(1);
    expect(service.getItems()[0]).toEqual({ id: 1, name: 'Laptop', price: 999, quantity: 1 });
  });

  it('should increment quantity when adding an existing item', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(1, 'Laptop', 999, 10);
    expect(service.getItems()).toHaveLength(1);
    expect(service.getItems()[0].quantity).toBe(2);
  });

  it('should return false when adding beyond maxStock', () => {
    service.addItem(1, 'Laptop', 999, 2);
    service.addItem(1, 'Laptop', 999, 2);
    const result = service.addItem(1, 'Laptop', 999, 2);
    expect(result).toBe(false);
    expect(service.getItems()[0].quantity).toBe(2);
  });

  it('should add multiple different items', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(2, 'Phone', 699, 10);
    expect(service.getItems()).toHaveLength(2);
  });

  // --- removeItem ---
  it('should remove an item from the cart', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(2, 'Phone', 699, 10);
    service.removeItem(1);
    expect(service.getItems()).toHaveLength(1);
    expect(service.getItems()[0].id).toBe(2);
  });

  it('should do nothing when removing a non-existent item', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.removeItem(99);
    expect(service.getItems()).toHaveLength(1);
  });

  // --- changeQty ---
  it('should increase quantity with positive delta', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.changeQty(1, 2);
    expect(service.getItems()[0].quantity).toBe(3);
  });

  it('should decrease quantity with negative delta', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(1, 'Laptop', 999, 10);
    service.changeQty(1, -1);
    expect(service.getItems()[0].quantity).toBe(1);
  });

  it('should remove item when quantity reaches zero', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.changeQty(1, -1);
    expect(service.getItems()).toHaveLength(0);
  });

  it('should remove item when quantity goes negative', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.changeQty(1, -5);
    expect(service.getItems()).toHaveLength(0);
  });

  it('should do nothing when changing qty of non-existent item', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.changeQty(99, 1);
    expect(service.getItems()).toHaveLength(1);
  });

  // --- clear ---
  it('should clear all items', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(2, 'Phone', 699, 10);
    service.clear();
    expect(service.getItems()).toHaveLength(0);
  });

  // --- getTotal ---
  it('should return 0 for empty cart', () => {
    expect(service.getTotal()).toBe(0);
  });

  it('should calculate total correctly', () => {
    service.addItem(1, 'Laptop', 100, 10);
    service.addItem(2, 'Phone', 50, 10);
    service.addItem(2, 'Phone', 50, 10); // qty=2
    expect(service.getTotal()).toBe(200); // 100*1 + 50*2
  });

  // --- getItemCount ---
  it('should return 0 for empty cart', () => {
    expect(service.getItemCount()).toBe(0);
  });

  it('should return total quantity of all items', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(2, 'Phone', 699, 10);
    service.addItem(2, 'Phone', 699, 10);
    expect(service.getItemCount()).toBe(3);
  });

  // --- getCartItemQty ---
  it('should return 0 for non-existent item', () => {
    expect(service.getCartItemQty(99)).toBe(0);
  });

  it('should return quantity of existing item', () => {
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(1, 'Laptop', 999, 10);
    expect(service.getCartItemQty(1)).toBe(2);
  });

  // --- items$ observable ---
  it('should emit updated items when cart changes', () => {
    const emitted: any[] = [];
    service.items$.subscribe(items => emitted.push(items));
    service.addItem(1, 'Laptop', 999, 10);
    service.addItem(2, 'Phone', 699, 10);
    service.removeItem(1);
    // Initial [] + addItem + addItem + removeItem = 4 emissions
    expect(emitted).toHaveLength(4);
    expect(emitted[3]).toHaveLength(1);
    expect(emitted[3][0].id).toBe(2);
  });
});
