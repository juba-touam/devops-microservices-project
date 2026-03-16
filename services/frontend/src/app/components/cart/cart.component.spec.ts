import { CartComponent } from './cart.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let cartServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    cartServiceMock = {
      getItems: jest.fn().mockReturnValue([]),
      getTotal: jest.fn().mockReturnValue(0),
      changeQty: jest.fn(),
      removeItem: jest.fn(),
    };
    routerMock = { navigate: jest.fn() };
    component = new CartComponent(cartServiceMock, routerMock);
  });

  it('should return items from cart service', () => {
    const items = [{ id: 1, name: 'Laptop', price: 999, quantity: 1 }];
    cartServiceMock.getItems.mockReturnValue(items);
    expect(component.items).toEqual(items);
  });

  it('should return total from cart service', () => {
    cartServiceMock.getTotal.mockReturnValue(999);
    expect(component.total).toBe(999);
  });

  it('should delegate changeQty to cart service', () => {
    component.changeQty(1, 1);
    expect(cartServiceMock.changeQty).toHaveBeenCalledWith(1, 1);
  });

  it('should delegate removeItem to cart service', () => {
    component.removeItem(1);
    expect(cartServiceMock.removeItem).toHaveBeenCalledWith(1);
  });

  it('should navigate to catalogue', () => {
    component.goToCatalogue();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to payment', () => {
    component.processPayment();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/payment']);
  });
});
