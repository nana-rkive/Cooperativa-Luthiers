import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthResponseDto, LoginDto } from '@luthiers/utils';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update signals on successful login', () => {
    const loginDto: LoginDto = { email: 'test@test.com', password: 'password' };
    const mockResponse: AuthResponseDto = {
      accessToken: 'mock-jwt-token',
      usuario: { id: '1', email: 'test@test.com', nome: 'Test User', roles: ['user'] }
    };

    service.login(loginDto).subscribe();

    const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginDto);
    
    req.flush(mockResponse);

    expect(service.jwtToken()).toBe('mock-jwt-token');
    expect(service.currentUser()).toEqual(mockResponse.usuario);
  });

  it('should clear signals on logout', () => {
    // First set values manually via signals to simulate a logged-in state
    service.jwtToken.set('existing-token');
    service.currentUser.set({ id: '1', email: 'test@test.com', nome: 'Test User', roles: [] });

    service.logout();

    expect(service.jwtToken()).toBeNull();
    expect(service.currentUser()).toBeNull();
  });
});
