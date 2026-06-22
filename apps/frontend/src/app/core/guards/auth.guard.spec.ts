import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { signal } from '@angular/core';

describe('authGuard', () => {
  let mockRouter: any;
  let mockAuthService: any;
  const mockJwtTokenSignal = signal<string | null>(null);

  beforeEach(() => {
    mockJwtTokenSignal.set(null);
    mockRouter = {
      parseUrl: vi.fn()
    };
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

  afterEach(() => {
    vi.clearAllMocks();
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
    const mockUrlTree = {} as any;
    mockRouter.parseUrl.mockReturnValue(mockUrlTree);
    
    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(mockUrlTree);
    expect(mockRouter.parseUrl).toHaveBeenCalledWith('/login');
  });
});
