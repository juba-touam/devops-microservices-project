import { Observable, of } from 'rxjs';

export class HttpClient {
  get = jest.fn().mockReturnValue(of([]));
  post = jest.fn().mockReturnValue(of({}));
  put = jest.fn().mockReturnValue(of({}));
  delete = jest.fn().mockReturnValue(of({}));
}
