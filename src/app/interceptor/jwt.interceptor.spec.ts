import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthenticationService } from '../services/authentication.service';
import {
  HTTP_INTERCEPTORS,
  HttpClient
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

describe('JwtInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        }
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait ajouter le header Authorization si le token est présent', fakeAsync(() => {
    mockAuthService.getToken.and.returnValue(Promise.resolve('fake-token'));

    let response: any;

    httpClient.get('/test-url').subscribe(res => {
      response = res;
    });

    tick();

    const req = httpMock.expectOne('/test-url');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toBe('Bearer fake-token');
    req.flush({}); // simule une réponse

    tick();

    expect(response).toBeDefined();
  }));

  it('ne doit pas ajouter de header si aucun token n’est présent', fakeAsync(() => {
    mockAuthService.getToken.and.returnValue(Promise.resolve(null));

    let response: any;

    httpClient.get('/test-url').subscribe(res => {
      response = res;
    });

    tick();

    const req = httpMock.expectOne('/test-url');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});

    tick();

    expect(response).toBeDefined();
  }));
});
