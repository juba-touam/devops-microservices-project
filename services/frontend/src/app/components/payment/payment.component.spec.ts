import { of, throwError } from 'rxjs';
import { PaymentComponent } from './payment.component';

describe('PaymentComponent', () => {
  let component: PaymentComponent;
  let httpMock: any;
  let cartServiceMock: any;
  let routerMock: any;

  beforeEach(() => {
    httpMock = { post: jest.fn().mockReturnValue(of({})) };
    cartServiceMock = {
      getItems: jest.fn().mockReturnValue([]),
      getTotal: jest.fn().mockReturnValue(0),
      clear: jest.fn(),
    };
    routerMock = { navigate: jest.fn() };
    component = new PaymentComponent(httpMock, cartServiceMock, routerMock);
  });

  it('should redirect to cart if no items', () => {
    cartServiceMock.getItems.mockReturnValue([]);

    component.ngOnInit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should process payment successfully', () => {
    const items = [{ id: 1, name: 'Laptop', price: 999, quantity: 1 }];
    cartServiceMock.getItems.mockReturnValue(items);
    cartServiceMock.getTotal.mockReturnValue(999);
    httpMock.post.mockReturnValue(of({ id: 'pay-1', amount: 999, currency: 'EUR', status: 'completed' }));

    component.ngOnInit();

    expect(component.success).toBe(true);
    expect(component.loading).toBe(false);
    expect(component.payment).toBeTruthy();
    expect(cartServiceMock.clear).toHaveBeenCalled();
  });

  it('should handle payment error', () => {
    const items = [{ id: 1, name: 'Laptop', price: 999, quantity: 1 }];
    cartServiceMock.getItems.mockReturnValue(items);
    cartServiceMock.getTotal.mockReturnValue(999);
    httpMock.post.mockReturnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(component.error).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should handle non-completed payment status', () => {
    const items = [{ id: 1, name: 'Laptop', price: 999, quantity: 1 }];
    cartServiceMock.getItems.mockReturnValue(items);
    cartServiceMock.getTotal.mockReturnValue(999);
    httpMock.post.mockReturnValue(of({ id: 'pay-1', amount: 999, currency: 'EUR', status: 'failed' }));

    component.ngOnInit();

    expect(component.success).toBe(false);
    expect(cartServiceMock.clear).not.toHaveBeenCalled();
  });

  it('should navigate to catalogue', () => {
    component.goToCatalogue();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to cart', () => {
    component.goToCart();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/cart']);
  });
});
