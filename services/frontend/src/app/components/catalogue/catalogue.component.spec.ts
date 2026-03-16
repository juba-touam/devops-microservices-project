import { of, throwError } from 'rxjs';
import { CatalogueComponent } from './catalogue.component';

describe('CatalogueComponent', () => {
  let component: CatalogueComponent;
  let catalogueServiceMock: any;
  let cartServiceMock: any;

  beforeEach(() => {
    catalogueServiceMock = {
      getProducts: jest.fn().mockReturnValue(of([])),
    };
    cartServiceMock = {
      getCartItemQty: jest.fn().mockReturnValue(0),
      addItem: jest.fn().mockReturnValue(true),
    };
    component = new CatalogueComponent(catalogueServiceMock, cartServiceMock);
  });

  it('should load products on init', () => {
    const products = [{ id: 1, name: 'Laptop', price: 999, category: 'Electronics', stock: 50 }];
    catalogueServiceMock.getProducts.mockReturnValue(of(products));

    component.ngOnInit();

    expect(component.products).toEqual(products);
    expect(component.loading).toBe(false);
    expect(component.error).toBe(false);
  });

  it('should set error on failed load', () => {
    catalogueServiceMock.getProducts.mockReturnValue(throwError(() => new Error('fail')));

    component.ngOnInit();

    expect(component.error).toBe(true);
    expect(component.loading).toBe(false);
  });

  it('should get cart quantity for a product', () => {
    cartServiceMock.getCartItemQty.mockReturnValue(3);
    expect(component.getCartQty(1)).toBe(3);
    expect(cartServiceMock.getCartItemQty).toHaveBeenCalledWith(1);
  });

  it('should return true for canAdd when stock available', () => {
    cartServiceMock.getCartItemQty.mockReturnValue(0);
    const product = { id: 1, name: 'Laptop', price: 999, category: 'Electronics', stock: 5 };
    expect(component.canAdd(product as any)).toBe(true);
  });

  it('should return false for canAdd when stock exhausted', () => {
    cartServiceMock.getCartItemQty.mockReturnValue(5);
    const product = { id: 1, name: 'Laptop', price: 999, category: 'Electronics', stock: 5 };
    expect(component.canAdd(product as any)).toBe(false);
  });

  it('should add to cart and show toast', () => {
    jest.useFakeTimers();
    const product = { id: 1, name: 'Laptop', price: 999, category: 'Electronics', stock: 5 };

    component.addToCart(product as any);

    expect(cartServiceMock.addItem).toHaveBeenCalledWith(1, 'Laptop', 999, 5);
    expect(component.toastVisible).toBe(true);
    expect(component.toastMessage).toContain('Laptop');

    jest.advanceTimersByTime(2000);
    expect(component.toastVisible).toBe(false);
    jest.useRealTimers();
  });

  it('should not show toast if addItem returns false', () => {
    cartServiceMock.addItem.mockReturnValue(false);
    const product = { id: 1, name: 'Laptop', price: 999, category: 'Electronics', stock: 5 };

    component.addToCart(product as any);

    expect(component.toastVisible).toBe(false);
  });
});
