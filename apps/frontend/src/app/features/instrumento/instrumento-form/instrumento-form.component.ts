import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InstrumentoService } from '../services/instrumento.service';
import { LuthierService } from '../../luthier/services/luthier.service';
import { CreateInstrumentoDto, UpdateInstrumentoDto, LuthierDto } from '@luthiers/utils';
import { parseAuthError } from '../../../core/utils/auth-error.util';

@Component({
  selector: 'app-instrumento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-3xl">
      <div class="mb-6 flex items-center gap-4">
        <a routerLink="/instrumentos" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </a>
        <h1 class="text-3xl font-bold text-gray-800">
          {{ isEditMode() ? 'Editar Instrumento' : 'Registrar Instrumento' }}
        </h1>
      </div>

      <!-- Initial Loading -->
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
              <label for="modeloMadeira" class="block text-sm font-medium text-gray-700 mb-1">Modelo / Madeira</label>
              <input 
                type="text" 
                id="modeloMadeira" 
                formControlName="modeloMadeira"
                placeholder="Ex: Violão de Nylon"
                class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                [ngClass]="{'border-red-500': fieldHasError('modeloMadeira'), 'border-gray-300': !fieldHasError('modeloMadeira')}"
              >
              @if (fieldHasError('modeloMadeira')) {
                <p class="mt-1 text-sm text-red-600">{{ getFieldError('modeloMadeira') }}</p>
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="luthierId" class="block text-sm font-medium text-gray-700 mb-1">Luthier Responsável</label>
                <select 
                  id="luthierId" 
                  formControlName="luthierId"
                  class="w-full px-3 py-2 border rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  [ngClass]="{'border-red-500': fieldHasError('luthierId'), 'border-gray-300': !fieldHasError('luthierId')}"
                >
                  <option [ngValue]="null" disabled>Selecione um luthier</option>
                  @for (luthier of luthiersList(); track luthier.id) {
                    <option [value]="luthier.id">{{ luthier.nomeMestre }}</option>
                  }
                </select>
                @if (fieldHasError('luthierId')) {
                  <p class="mt-1 text-sm text-red-600">{{ getFieldError('luthierId') }}</p>
                }
              </div>

              <div>
                <label for="dataEntrada" class="block text-sm font-medium text-gray-700 mb-1">Data de Entrada</label>
                <input 
                  type="date" 
                  id="dataEntrada" 
                  formControlName="dataEntrada"
                  class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  [ngClass]="{'border-red-500': fieldHasError('dataEntrada'), 'border-gray-300': !fieldHasError('dataEntrada')}"
                >
                @if (fieldHasError('dataEntrada')) {
                  <p class="mt-1 text-sm text-red-600">{{ getFieldError('dataEntrada') }}</p>
                }
              </div>
            </div>

            <div class="mb-6">
              <label for="custoReparo" class="block text-sm font-medium text-gray-700 mb-1">Custo do Reparo (R$)</label>
              <input 
                type="number" 
                id="custoReparo" 
                formControlName="custoReparo"
                min="0"
                step="0.01"
                class="w-full md:w-1/2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                [ngClass]="{'border-red-500': fieldHasError('custoReparo'), 'border-gray-300': !fieldHasError('custoReparo')}"
              >
              @if (fieldHasError('custoReparo')) {
                <p class="mt-1 text-sm text-red-600">{{ getFieldError('custoReparo') }}</p>
              }
            </div>

            <div class="mb-6 flex items-center">
              <input 
                id="reparoConcluido" 
                type="checkbox" 
                formControlName="reparoConcluido"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="reparoConcluido" class="ml-2 block text-sm text-gray-900">
                Reparo Concluído
              </label>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                routerLink="/instrumentos"
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
export class InstrumentoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private instrumentoService = inject(InstrumentoService);
  private luthierService = inject(LuthierService);

  form = this.fb.group({
    modeloMadeira: ['', Validators.required],
    dataEntrada: ['', Validators.required],
    reparoConcluido: [false],
    custoReparo: [0, [Validators.required, Validators.min(0)]],
    luthierId: [null as number | null, Validators.required]
  });

  instrumentoId = signal<number | null>(null);
  isEditMode = computed(() => this.instrumentoId() !== null);
  
  luthiersList = signal<LuthierDto[]>([]);

  initialLoading = signal<boolean>(true);
  saving = signal<boolean>(false);
  globalError = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.instrumentoId.set(Number(idParam));
    }
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.initialLoading.set(true);
    
    this.luthierService.getAll().subscribe({
      next: (luthiers) => {
        this.luthiersList.set(luthiers);
        
        if (this.isEditMode()) {
          this.loadInstrumento(this.instrumentoId()!);
        } else {
          this.initialLoading.set(false);
        }
      },
      error: () => {
        this.globalError.set('Erro ao carregar a lista de luthiers. Não será possível registrar um instrumento.');
        this.initialLoading.set(false);
      }
    });
  }

  loadInstrumento(id: number): void {
    this.instrumentoService.getById(id).subscribe({
      next: (instrumento) => {
        const dataEntradaFormated = new Date(instrumento.dataEntrada).toISOString().split('T')[0];
        
        this.form.patchValue({
          modeloMadeira: instrumento.modeloMadeira,
          dataEntrada: dataEntradaFormated,
          reparoConcluido: instrumento.reparoConcluido,
          custoReparo: instrumento.custoReparo,
          luthierId: instrumento.luthierId
        });
        this.initialLoading.set(false);
      },
      error: () => {
        this.globalError.set('Erro ao carregar dados do instrumento. Ele pode não existir mais.');
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

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.hasError('backend')) {
        control.setErrors(null);
      }
    });

    const formData = this.form.value;
    const dataToSend = {
      ...formData,
      luthierId: Number(formData.luthierId) // Ensure it is passed as a number
    };

    const request$ = this.isEditMode() 
      ? this.instrumentoService.update(this.instrumentoId()!, dataToSend as UpdateInstrumentoDto)
      : this.instrumentoService.create(dataToSend as CreateInstrumentoDto);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.router.navigate(['/instrumentos']);
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
