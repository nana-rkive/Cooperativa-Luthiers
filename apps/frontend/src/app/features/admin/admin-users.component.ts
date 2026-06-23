import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UsuarioService } from './services/usuario.service';
import { AuthUserDto } from '@luthiers/utils';
import { parseAuthError } from '../../core/utils/auth-error.util';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgClass, RouterLink],
  template: `
    <div class="container mx-auto p-4 max-w-6xl">
      <div class="mb-6">
        <div class="flex items-center mb-4">
          <a routerLink="/dashboard" class="text-gray-500 hover:text-brand-brown transition-colors flex items-center gap-2 font-semibold">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Voltar
          </a>
        </div>
        <h1 class="text-3xl font-extrabold text-brand-brown">Gerenciar Usuários</h1>
      </div>

      <!-- Notificação de Erro (Strict Error Handling) -->
      @if (globalError()) {
        <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r shadow-sm flex justify-between items-center" role="alert">
          <div>
            <p class="font-bold text-red-800">Atenção</p>
            <p class="text-red-700">{{ globalError() }}</p>
          </div>
          <button (click)="globalError.set(null)" class="text-red-500 hover:text-red-700 focus:outline-none">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }

      <!-- Loading State -->
      @if (loading()) {
        <div class="flex justify-center items-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-brown-light"></div>
          <span class="ml-3 text-lg text-gray-600 font-medium">Carregando usuários...</span>
        </div>
      } @else if (!initialError()) {
        
        <!-- Empty State -->
        @if (isEmpty()) {
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-semibold text-brand-brown">Nenhum usuário encontrado</h3>
          </div>
        } @else {
          <!-- Success State: Table -->
          <div class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-[#f3e8e2]">
                <tr>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">Nome</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">E-mail</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">Cargo</th>
                  <th scope="col" class="px-6 py-3.5 text-left text-xs font-bold text-brand-brown uppercase tracking-wider">Status</th>
                  <th scope="col" class="px-6 py-3.5 text-right text-xs font-bold text-brand-brown uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (user of data(); track user.id) {
                  <tr class="hover:bg-brand-offwhite hover:bg-opacity-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-semibold text-gray-900">{{ user.primeiroNome }} {{ user.sobrenome }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-600 font-medium">{{ user.email }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full" 
                            [ngClass]="user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-gray-50 text-gray-600 border border-gray-200'">
                        {{ user.role === 'admin' ? 'Administrador' : 'Luthier' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      @if (user.ativo) {
                        <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                          Ativo
                        </span>
                      } @else {
                        <span class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-50 text-red-700 border border-red-200">
                          Inativo
                        </span>
                      }
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                      <button 
                        (click)="toggleActive(user)" 
                        [disabled]="togglingId() === user.id"
                        class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-bold rounded-lg shadow-sm text-amber-950 bg-amber-400 hover:bg-amber-500 transition-colors focus:outline-none disabled:opacity-50"
                      >
                        @if (togglingId() === user.id) {
                          <svg class="animate-spin h-4 w-4 mx-auto text-amber-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        } @else {
                          {{ user.ativo ? 'Desativar' : 'Ativar' }}
                        }
                      </button>
                      <button 
                        (click)="excluirUsuario(user)" 
                        [disabled]="deletingId() === user.id"
                        class="text-red-600 hover:text-red-900 font-semibold ml-4 focus:outline-none transition-colors disabled:opacity-50"
                      >
                        @if (deletingId() === user.id) {
                          <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        } @else {
                          Excluir
                        }
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      }
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  data = signal<AuthUserDto[]>([]);
  loading = signal<boolean>(true);
  initialError = signal<string | null>(null);
  globalError = signal<string | null>(null);
  
  isEmpty = computed(() => this.data().length === 0);
  togglingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.initialError.set(null);
    this.globalError.set(null);
    
    this.usuarioService.getAll().subscribe({
      next: (users) => {
        this.data.set(users);
        this.loading.set(false);
      },
      error: (err) => {
        // Strict error handling: from backend message via parseAuthError
        const parsed = parseAuthError(err);
        const errorMessage = parsed['global'] || 'Erro desconhecido ao carregar usuários.';
        this.initialError.set(errorMessage);
        this.globalError.set(errorMessage);
        this.loading.set(false);
      }
    });
  }

  toggleActive(user: AuthUserDto): void {
    if (this.togglingId() !== null) return;
    
    this.togglingId.set(user.id);
    this.globalError.set(null);

    const newStatus = !user.ativo;

    this.usuarioService.toggleActive(user.id, newStatus).subscribe({
      next: () => {
        this.data.update(list => 
          list.map(u => u.id === user.id ? { ...u, ativo: newStatus } : u)
        );
        this.togglingId.set(null);
      },
      error: (err) => {
        // Strict error handling
        const parsed = parseAuthError(err);
        this.globalError.set(parsed['global'] || 'Erro desconhecido ao alterar status do usuário.');
        this.togglingId.set(null);
      }
    });
  }

  excluirUsuario(user: AuthUserDto): void {
    if (confirm('Tem certeza que deseja excluir definitivamente este usuário?')) {
      if (this.deletingId() !== null) return;
      
      this.deletingId.set(user.id);
      this.globalError.set(null);

      this.usuarioService.deleteUser(user.id).subscribe({
        next: () => {
          this.data.update(list => list.filter(u => u.id !== user.id));
          this.deletingId.set(null);
        },
        error: (err) => {
          const parsed = parseAuthError(err);
          this.globalError.set(parsed['global'] || 'Erro desconhecido ao excluir usuário.');
          this.deletingId.set(null);
        }
      });
    }
  }
}
