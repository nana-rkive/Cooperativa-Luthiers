import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';
import { signal, WritableSignal } from '@angular/core';

describe('authGuard', () => {
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: { jwtToken: WritableSignal<string | null> };
  const mockJwtTokenSignal = signal<string | null>(null);

  beforeEach(() => {
    mockJwtTokenSignal.set(null);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['parseUrl']);
    mockAuthService = {
      jwtToken: mockJwtTokenSignal
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
  });

  it('should return true if token is valid', () => {
    mockJwtTokenSignal.set('valid-token');
    
    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(true);
    expect(mockRouter.parseUrl).not.toHaveBeenCalled();
  });

  it('should return a UrlTree to /login if token is null', () => {
    mockJwtTokenSignal.set(null);
    const mockUrlTree = {} as UrlTree;
    mockRouter.parseUrl.and.returnValue(mockUrlTree);
    
    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(mockUrlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
  });
});
