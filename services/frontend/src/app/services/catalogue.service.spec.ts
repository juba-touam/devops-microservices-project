import { of, throwError } from 'rxjs';
import { CatalogueService } from './catalogue.service';

describe('CatalogueService', () => {
  let service: CatalogueService;
  let httpMock: any;

  beforeEach(() => {
    httpMock = { get: jest.fn(), post: jest.fn() };
    service = new CatalogueService(httpMock);
  });

  it('should call GET /api/catalogue/catalogue', (done) => {
    const mockProducts = [{ id: 1, name: 'Laptop', price: 999, category: 'Electronics', stock: 50 }];
    httpMock.get.mockReturnValue(of(mockProducts));

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
      expect(httpMock.get).toHaveBeenCalledWith('/api/catalogue/catalogue');
      done();
    });
  });

  it('should propagate errors', (done) => {
    httpMock.get.mockReturnValue(throwError(() => new Error('Network error')));

    service.getProducts().subscribe({
      error: (err) => {
        expect(err.message).toBe('Network error');
        done();
      },
    });
  });
});
