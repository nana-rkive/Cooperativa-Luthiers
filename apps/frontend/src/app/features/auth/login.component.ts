import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { parseAuthError } from '../../core/utils/auth-error.util';
import { LoginDto } from '@luthiers/utils';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  template: `
    <div class="login-container max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
      
      @if (globalError()) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {{ globalError() }}
        </div>
      }

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">E-mail</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            [ngClass]="{'border-red-500': fieldHasError('email')}"
            id="email" 
            type="email" 
            formControlName="email">
          @if (fieldHasError('email')) {
            <p class="text-red-500 text-xs italic mt-1">
              {{ getFieldError('email') }}
            </p>
          }
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="senha">Senha</label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" 
            [ngClass]="{'border-red-500': fieldHasError('senha')}"
            id="senha" 
            type="password" 
            formControlName="senha">
          @if (fieldHasError('senha')) {
            <p class="text-red-500 text-xs italic mt-1">
              {{ getFieldError('senha') }}
            </p>
          }
        </div>

        <div class="flex items-center justify-between">
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
            type="submit"
            [disabled]="loading()">
            {{ loading() ? 'Entrando...' : 'Entrar' }}
          </button>
        </div>
        
        <div class="text-center mt-4">
          <a routerLink="/register" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Não tem uma conta? Cadastre-se
          </a>
        </div>
      </form>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    senha: ['', Validators.required]
  });

  loading = signal(false);
  globalError = signal<string | null>(null);

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.globalError.set(null);
    
    // reset external backend errors
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      if (control?.hasError('backend')) {
        control.setErrors(null);
      }
    });

    const credentials = this.loginForm.value as LoginDto;

    this.authService.login(credentials).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        const parsedErrors = parseAuthError(err);
        
        if (parsedErrors['global']) {
          this.globalError.set(parsedErrors['global']);
        }
        
        Object.keys(parsedErrors).forEach(field => {
          if (field !== 'global' && this.loginForm.contains(field)) {
            this.loginForm.get(field)?.setErrors({ backend: parsedErrors[field] });
          }
        });
      }
    });
  }

  fieldHasError(field: string): boolean {
    const control = this.loginForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getFieldError(field: string): string {
    const control = this.loginForm.get(field);
    if (!control) return '';
    
    if (control.hasError('required')) return 'Campo obrigatório';
    if (control.hasError('email')) return 'E-mail inválido';
    if (control.hasError('backend')) return control.getError('backend');
    
    return 'Campo inválido';
  }
}
