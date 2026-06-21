import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LuthierService } from '../services/luthier.service';
import { CreateLuthierDto, UpdateLuthierDto } from '@luthiers/utils';
import { parseAuthError } from '../../../core/utils/auth-error.util';

@Component({
  selector: 'app-luthier-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-3xl">
      <div class="mb-6 flex items-center gap-4">
        <a routerLink="/luthiers" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </a>
        <h1 class="text-3xl font-bold text-gray-800">
          {{ isEditMode() ? 'Editar Luthier' : 'Novo Luthier' }}
        </h1>
      </div>

      <!-- Initial Loading for Edit Mode -->
      @if (initialLoading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-lg text-gray-600">Carregando dados...</span>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          
          @if (globalError()) {
            <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
              {{ globalError() }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            
            <div class="mb-4">
              <label for="nomeMestre" class="block text-sm font-medium text-gray-700 mb-1">Nome do Mestre</label>
              <input 
                type="text" 
                id="nomeMestre" 
                formControlName="nomeMestre"
                class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                [ngClass]="{'border-red-500': fieldHasError('nomeMestre'), 'border-gray-300': !fieldHasError('nomeMestre')}"
              >
              @if (fieldHasError('nomeMestre')) {
                <p class="mt-1 text-sm text-red-600">{{ getFieldError('nomeMestre') }}</p>
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="dataAbertura" class="block text-sm font-medium text-gray-700 mb-1">Data de Abertura</label>
                <input 
                  type="date" 
                  id="dataAbertura" 
                  formControlName="dataAbertura"
                  class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  [ngClass]="{'border-red-500': fieldHasError('dataAbertura'), 'border-gray-300': !fieldHasError('dataAbertura')}"
                >
                @if (fieldHasError('dataAbertura')) {
                  <p class="mt-1 text-sm text-red-600">{{ getFieldError('dataAbertura') }}</p>
                }
              </div>

              <div>
                <label for="bancadasNum" class="block text-sm font-medium text-gray-700 mb-1">Qtd. de Bancadas</label>
                <input 
                  type="number" 
                  id="bancadasNum" 
                  formControlName="bancadasNum"
                  min="0"
                  class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  [ngClass]="{'border-red-500': fieldHasError('bancadasNum'), 'border-gray-300': !fieldHasError('bancadasNum')}"
                >
                @if (fieldHasError('bancadasNum')) {
                  <p class="mt-1 text-sm text-red-600">{{ getFieldError('bancadasNum') }}</p>
                }
              </div>
            </div>

            <div class="mb-6 flex items-center">
              <input 
                id="certificada" 
                type="checkbox" 
                formControlName="certificada"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="certificada" class="ml-2 block text-sm text-gray-900">
                Oficina Certificada
              </label>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                routerLink="/luthiers"
                class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                [disabled]="saving()"
                class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
              >
                @if (saving()) {
                  <svg class="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                }
                Salvar
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `
})
export class LuthierFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private luthierService = inject(LuthierService);

  form = this.fb.group({
    nomeMestre: ['', Validators.required],
    dataAbertura: ['', Validators.required],
    certificada: [false],
    bancadasNum: [0, [Validators.required, Validators.min(0)]]
  });

  luthierId = signal<string | null>(null);
  isEditMode = computed(() => this.luthierId() !== null);
  
  initialLoading = signal<boolean>(false);
  saving = signal<boolean>(false);
  globalError = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.luthierId.set(id);
      this.loadLuthier(id);
    }
  }

  loadLuthier(id: string): void {
    this.initialLoading.set(true);
    this.luthierService.getById(id).subscribe({
      next: (luthier) => {
        // Date input expects YYYY-MM-DD
        const dataAberturaFormated = new Date(luthier.dataAbertura).toISOString().split('T')[0];
        
        this.form.patchValue({
          nomeMestre: luthier.nomeMestre,
          dataAbertura: dataAberturaFormated,
          certificada: luthier.certificada,
          bancadasNum: luthier.bancadasNum
        });
        this.initialLoading.set(false);
      },
      error: () => {
        this.globalError.set('Erro ao carregar dados do luthier. Ele pode não existir mais.');
        this.initialLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.globalError.set(null);

    // Limpar erros de backend anteriores
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.hasError('backend')) {
        control.setErrors(null);
      }
    });

    const formData = this.form.value;
    const dataToSend = {
      ...formData,
    };

    const request$ = this.isEditMode() 
      ? this.luthierService.update(this.luthierId()!, dataToSend as UpdateLuthierDto)
      : this.luthierService.create(dataToSend as CreateLuthierDto);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/luthiers']);
      },
      error: (err) => {
        this.saving.set(false);
        const parsedErrors = parseAuthError(err);
        
        if (parsedErrors['global']) {
          this.globalError.set(parsedErrors['global']);
        }
        
        Object.keys(parsedErrors).forEach(field => {
          if (field !== 'global' && this.form.contains(field)) {
            this.form.get(field)?.setErrors({ backend: parsedErrors[field] });
          }
        });
      }
    });
  }

  fieldHasError(field: string): boolean {
    const control = this.form.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (!control) return '';
    
    if (control.hasError('required')) return 'Campo obrigatório';
    if (control.hasError('min')) return 'Valor inválido';
    if (control.hasError('backend')) return control.getError('backend');
    
    return 'Campo inválido';
  }
}
