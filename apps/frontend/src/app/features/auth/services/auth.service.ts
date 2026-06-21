import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponseDto, LoginDto, RegisterDto } from '@luthiers/utils';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);

  // Token JWT mantido estritamente em memória via Signal
  readonly jwtToken = signal<string | null>(null);
  readonly currentUser = signal<AuthResponseDto['user'] | null>(null);

  login(credentials: LoginDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.jwtToken.set(response.accessToken);
        this.currentUser.set(response.user);
      })
    );
  }

  register(data: RegisterDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${environment.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        this.jwtToken.set(response.accessToken);
        this.currentUser.set(response.user);
      })
    );
  }

  logout(): void {
    this.jwtToken.set(null);
    this.currentUser.set(null);
  }
}
