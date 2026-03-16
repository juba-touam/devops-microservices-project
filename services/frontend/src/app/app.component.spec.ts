import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let cartServiceMock: any;

  beforeEach(() => {
    cartServiceMock = {
      getItemCount: jest.fn().mockReturnValue(0),
      items$: { subscribe: jest.fn() },
    };
    component = new AppComponent(cartServiceMock);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have cartService injected', () => {
    expect(component.cartService).toBe(cartServiceMock);
  });
});
