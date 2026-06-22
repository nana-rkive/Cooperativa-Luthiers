import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { InstrumentoDto } from '@luthiers/utils';
import { InstrumentoService } from '../services/instrumento.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-instrumento-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-6xl">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center gap-4">
          <a routerLink="/dashboard" class="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium">
            <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Voltar
          </a>
          <h1 class="text-3xl font-bold text-gray-800">Instrumentos em Manutenção</h1>
        </div>
        @if (authService.isLuthier()) {
          <a routerLink="/instrumentos/novo" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors">
            Novo Registro
          </a>
        }
      </div>

      <!-- Error State -->
      @if (error()) {
        <div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
          <p class="font-bold">Erro ao carregar dados</p>
          <p>{{ error() }}</p>
          <button (click)="loadInstrumentos()" class="mt-2 text-sm underline text-red-800 hover:text-red-900">
            Tentar novamente
          </button>
        </div>
      }

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-lg text-gray-600">Buscando instrumentos...</span>
        </div>
      } @else if (!error()) {
        
        <!-- Empty State -->
        @if (isEmpty()) {
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet" class="mx-auto h-12 w-12 text-gray-400">
              <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">
                <path d="M4445 5111 c-57 -15 -108 -45 -165 -98 l-58 -54 -38 26 c-132 89 -289 -76 -199 -210 l26 -37 -95 -131 c-84 -117 -149 -186 -565 -601 l-470 -470 -88 41 c-172 81 -315 109 -502 100 -266 -14 -494 -119 -684 -316 -104 -108 -185 -229 -243 -363 -78 -179 -99 -193 -299 -201 -407 -17 -737 -235 -931 -613 -90 -178 -128 -342 -128 -559 -1 -177 14 -265 66 -415 80 -226 151 -323 478 -651 146 -146 297 -289 335 -318 96 -71 290 -165 403 -195 441 -117 903 7 1206 324 189 198 280 416 293 700 9 201 16 211 228 315 166 81 232 127 348 243 267 264 367 652 262 1017 -15 50 -41 122 -60 160 l-34 70 467 468 c428 430 478 477 605 567 l138 98 36 -24 c45 -31 124 -33 167 -5 69 46 89 144 42 211 l-24 35 54 57 c64 67 92 124 100 205 15 140 -31 237 -190 400 -121 126 -186 176 -266 207 -50 20 -169 29 -215 17z m133 -310 c44 -23 202 -183 226 -228 23 -47 20 -65 -19 -103 l-36 -34 -155 155 -156 156 35 36 c39 42 53 45 105 18z m-196 -428 l148 -148 -62 -43 -62 -42 -133 132 -132 132 41 58 c23 32 44 58 47 58 3 0 73 -66 153 -147z m-320 -310 c60 -59 108 -112 108 -118 0 -19 -1249 -1260 -1258 -1250 -4 6 -27 36 -51 67 -23 31 -68 76 -99 99 -31 24 -61 47 -67 51 -10 9 1231 1258 1250 1258 5 0 58 -48 117 -107z m-1568 -698 c75 -16 156 -44 156 -54 0 -3 -71 -77 -158 -164 l-157 -157 -75 -21 c-145 -40 -254 -117 -334 -237 -65 -99 -97 -202 -97 -316 -1 -174 49 -294 171 -416 120 -121 238 -170 406 -170 166 0 286 51 404 169 81 82 127 161 155 266 15 58 21 66 179 224 l163 163 22 -62 c119 -355 -46 -735 -398 -913 -47 -24 -102 -50 -121 -57 -59 -22 -166 -98 -202 -142 -89 -110 -108 -171 -119 -363 -9 -164 -29 -257 -78 -353 -145 -287 -492 -478 -837 -459 -183 10 -365 74 -503 176 -93 70 -559 542 -611 620 -96 144 -149 305 -157 481 -17 360 175 705 472 846 104 49 173 64 340 73 164 9 214 23 305 81 95 61 147 132 216 293 158 369 503 567 858 492z m-7 -690 c60 -18 135 -81 165 -138 26 -53 35 -152 18 -213 -19 -66 -78 -136 -141 -168 -74 -37 -173 -37 -247 0 -170 84 -208 301 -78 441 78 84 174 110 283 78z"/>
                <path d="M927 2035 c-51 -18 -73 -39 -93 -92 -34 -89 -45 -75 484 -606 262 -263 489 -485 504 -493 35 -18 101 -18 138 1 56 29 88 96 75 162 -6 31 -73 104 -482 517 -261 265 -487 488 -502 497 -39 24 -81 29 -124 14z"/>
              </g>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhum instrumento registrado</h3>
            <p class="mt-2 text-sm text-gray-500">Clique em 'Novo Registro' no topo da página para adicionar um instrumento para acompanhamento.</p>
          </div>
        } @else {
          <!-- Success State: Table -->
          <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo / Madeira</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luthier Responsável</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Custo (R$)</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrada</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  @if (authService.isLuthier()) {
                    <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  }
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (item of data(); track item.id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ item.modeloMadeira }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-700 font-medium">
                        {{ item.luthier?.nomeMestre || 'ID: ' + item.luthierId }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500">{{ item.custoReparo | currency:'BRL':'symbol':'1.2-2' }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ item.dataEntrada | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (item.reparoConcluido) {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Concluído
                        </span>
                      } @else {
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Em Andamento
                        </span>
                      }
                    </td>
                    @if (authService.isLuthier()) {
                      <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a [routerLink]="['/instrumentos', item.id, 'editar']" class="text-indigo-600 hover:text-indigo-900 mr-4">Editar</a>
                        <button (click)="confirmDelete(item)" class="text-red-600 hover:text-red-900">Excluir</button>
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
    @if (itemToDelete()) {
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
                    Excluir Instrumento
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Tem certeza que deseja excluir o instrumento <strong *ngIf="itemToDelete() as item">{{ item.modeloMadeira }}</strong>? Esta ação não poderá ser desfeita.
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
export class InstrumentoListComponent implements OnInit {
  private instrumentoService = inject(InstrumentoService);
  authService = inject(AuthService);

  data = signal<InstrumentoDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  isEmpty = computed(() => this.data().length === 0);

  itemToDelete = signal<InstrumentoDto | null>(null);
  deleting = signal<boolean>(false);

  ngOnInit(): void {
    this.loadInstrumentos();
  }

  loadInstrumentos(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.instrumentoService.getAll().subscribe({
      next: (instrumentos) => {
        this.data.set(instrumentos);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Ocorreu um erro ao buscar os instrumentos.');
        this.loading.set(false);
      }
    });
  }

  confirmDelete(item: InstrumentoDto): void {
    this.itemToDelete.set(item);
  }

  cancelDelete(): void {
    if (!this.deleting()) {
      this.itemToDelete.set(null);
    }
  }

  executeDelete(): void {
    const target = this.itemToDelete();
    if (!target) return;

    this.deleting.set(true);
    this.instrumentoService.delete(target.id).subscribe({
      next: () => {
        this.data.update(list => list.filter(item => item.id !== target.id));
        this.deleting.set(false);
        this.itemToDelete.set(null);
      },
      error: () => {
        this.deleting.set(false);
        this.itemToDelete.set(null);
        this.error.set('Não foi possível excluir o instrumento selecionado.');
      }
    });
  }
}
