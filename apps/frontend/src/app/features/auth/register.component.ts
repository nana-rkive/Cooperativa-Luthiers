import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { parseAuthError } from '../../core/utils/auth-error.util';
import { RegisterDto } from '@luthiers/utils';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    primeiroNome: ['', Validators.required],
    sobrenome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    senha: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/.*[A-Z].*/)]]
  });

  loading = signal(false);
  globalError = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.globalError.set(null);
    this.successMessage.set(null);
    
    // reset external backend errors
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      if (control?.hasError('backend')) {
        control.setErrors(null);
      }
    });

    const data = this.registerForm.value as RegisterDto;

    this.registerForm.markAllAsTouched();

    this.authService.register(data).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Cadastro realizado! Aguardando ativação da conta.');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3500);
      },
      error: (err) => {
        this.loading.set(false);
        const parsedErrors = parseAuthError(err);
        
        if (parsedErrors['global']) {
          this.globalError.set(parsedErrors['global']);
        }
        
        Object.keys(parsedErrors).forEach(field => {
          if (field !== 'global' && this.registerForm.contains(field)) {
            this.registerForm.get(field)?.setErrors({ backend: parsedErrors[field] });
          }
        });
      }
    });
  }

  fieldHasError(field: string): boolean {
    const control = this.registerForm.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getFieldError(field: string): string {
    const control = this.registerForm.get(field);
    if (!control) return '';
    
    if (control.hasError('required')) return 'Campo obrigatório';
    if (control.hasError('email')) return 'E-mail inválido';
    if (control.hasError('minlength')) return 'A senha deve ter no mínimo 8 caracteres';
    if (control.hasError('pattern')) return 'A senha deve conter pelo menos uma letra maiúscula';
    if (control.hasError('backend')) return control.getError('backend');
    
    return 'Campo inválido';
  }
}
