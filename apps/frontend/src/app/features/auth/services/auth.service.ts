import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Token JWT mantido estritamente em memória via Signal
  readonly jwtToken = signal<string | null>(null);

  logout(): void {
    this.jwtToken.set(null);
  }
}
