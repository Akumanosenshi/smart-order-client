import { JwtInterceptor } from './jwt.interceptor';
import { AuthenticationService } from '../services/authentication.service';

describe('JwtInterceptor', () => {
  it('devrait être créé', () => {
    const mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);
    const interceptor = new JwtInterceptor(mockAuthService);
    expect(interceptor).toBeTruthy();
  });
});
