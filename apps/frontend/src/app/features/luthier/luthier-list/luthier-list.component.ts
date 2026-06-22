import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LuthierDto } from '@luthiers/utils';
import { LuthierService } from '../services/luthier.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-luthier-list',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-5xl">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <a routerLink="/dashboard" class="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Voltar
          </a>
          <h1 class="text-3xl font-bold text-gray-800">Mestres Luthiers</h1>
        </div>
        @if (authService.isAdmin()) {
          <a routerLink="/luthiers/novo" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors">
            Novo Luthier
          </a>
        }
      </div>

      <!-- Error State -->
      @if (error()) {
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
          <p class="font-bold">Erro ao carregar dados</p>
          <p>{{ error() }}</p>
          <button (click)="loadLuthiers()" class="mt-2 text-sm underline text-red-800 hover:text-red-900">
            Tentar novamente
          </button>
        </div>
      }

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-lg text-gray-600">Carregando luthiers...</span>
        </div>
      } @else if (!error()) {
        
        <!-- Empty State -->
        @if (isEmpty()) {
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum luthier cadastrado</h3>
            <p class="mt-2 text-sm text-gray-500">Clique em 'Novo Luthier' no topo da página para adicionar o primeiro mestre à cooperativa.</p>
          </div>
        } @else {
          <!-- Success State: Table -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bancadas</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificação</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abertura</th>
                  @if (authService.isAdmin()) {
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  }
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (luthier of data(); track luthier.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ luthier.nomeMestre }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ luthier.bancadasNum }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (luthier.certificada) {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Sim
                        </span>
                      } @else {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Não
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ luthier.dataAbertura | date:'dd/MM/yyyy' }}
                    </td>
                    @if (authService.isAdmin()) {
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a [routerLink]="['/luthiers', luthier.id, 'editar']" class="text-indigo-600 hover:text-indigo-900 mr-4">Editar</a>
                        <button (click)="confirmDelete(luthier)" class="text-red-600 hover:text-red-900">Excluir</button>
                      </td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </div>

    <!-- Delete Confirmation Modal -->
    @if (luthierToDelete()) {
      <div class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" (click)="cancelDelete()"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    Excluir Luthier
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Tem certeza que deseja excluir o luthier 
                      @if (luthierToDelete(); as luthier) {
                        <strong>{{ luthier.nomeMestre }}</strong>
                      }? Esta ação não poderá ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" (click)="executeDelete()" [disabled]="deleting()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                {{ deleting() ? 'Excluindo...' : 'Excluir' }}
              </button>
              <button type="button" (click)="cancelDelete()" [disabled]="deleting()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class LuthierListComponent implements OnInit {
  private luthierService = inject(LuthierService);
  authService = inject(AuthService);

  data = signal<LuthierDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  isEmpty = computed(() => this.data().length === 0);

  luthierToDelete = signal<LuthierDto | null>(null);
  deleting = signal<boolean>(false);

  ngOnInit(): void {
    this.loadLuthiers();
  }

  loadLuthiers(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.luthierService.getAll().subscribe({
      next: (luthiers) => {
        this.data.set(luthiers);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Ocorreu um erro ao buscar os luthiers.');
        this.loading.set(false);
      }
    });
  }

  confirmDelete(luthier: LuthierDto): void {
    this.luthierToDelete.set(luthier);
  }

  cancelDelete(): void {
    if (!this.deleting()) {
      this.luthierToDelete.set(null);
    }
  }

  executeDelete(): void {
    const target = this.luthierToDelete();
    if (!target) return;

    this.deleting.set(true);
    this.luthierService.delete(target.id).subscribe({
      next: () => {
        this.data.update(list => list.filter(l => l.id !== target.id));
        this.deleting.set(false);
        this.luthierToDelete.set(null);
      },
      error: () => {
        this.deleting.set(false);
        this.luthierToDelete.set(null);
        this.error.set('Não foi possível excluir o luthier selecionado.');
      }
    });
  }
}
