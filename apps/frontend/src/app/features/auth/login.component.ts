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
    <div class="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative" style="background-image: url('login-bg.png');">
      <!-- Película fosca branca com desfoque -->
      <div class="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      <!-- Login Card -->
      <div class="login-container relative z-10 max-w-md w-full mx-4 p-8 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/40">
        <div class="text-center mb-8">
          <span class="text-xs uppercase tracking-widest text-brand-brown-light font-bold block mb-2">Painel de Acesso</span>
          <h1 class="text-3xl font-extrabold text-brand-brown tracking-tight mb-1">
            Cooperativa de Luthiers
          </h1>
          <p class="text-sm text-gray-500 font-medium">Faça login para gerenciar a oficina</p>
        </div>
        
        @if (globalError()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm">
            {{ globalError() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="email">E-mail</label>
            <input 
              class="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3.5 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-brown-light focus:border-transparent transition-all" 
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
            <label class="block text-gray-700 text-sm font-semibold mb-2" for="senha">Senha</label>
            <input 
              class="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2.5 px-3.5 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-brand-brown-light focus:border-transparent transition-all" 
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
              class="bg-brand-brown-light hover:bg-opacity-95 text-white font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-brown-light focus:ring-offset-2 w-full transition-all shadow-sm" 
              type="submit"
              [disabled]="loading()">
              {{ loading() ? 'Entrando...' : 'Entrar' }}
            </button>
          </div>
          
          <div class="text-center mt-6">
            <a routerLink="/register" class="inline-block align-baseline font-semibold text-sm text-brand-brown-light hover:text-brand-brown transition-colors">
              Não tem uma conta? Cadastre-se
            </a>
          </div>
        </form>
      </div>
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
