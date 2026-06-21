import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass, TitleCasePipe } from '@angular/common';
import { AdminService } from './services/admin.service';
import { AuthUserDto } from '@luthiers/utils';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgClass, TitleCasePipe],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Gestão de Usuários</h1>
      
      @if (loading()) {
        <div class="text-center p-8 text-gray-500">Carregando usuários...</div>
      } @else if (error()) {
        <div class="bg-red-100 text-red-700 p-4 rounded mb-4">{{ error() }}</div>
      } @else {
        <div class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Papel</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (user of users(); track user.id) {
                <tr class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ user.primeiroNome }} {{ user.sobrenome }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500">{{ user.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'">
                      {{ user.role | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="user.ativo ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                      {{ user.ativo ? 'Ativo' : 'Aguardando Ativação' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      (click)="toggleStatus(user)"
                      class="text-indigo-600 hover:text-indigo-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                      [disabled]="user.role === 'admin'">
                      {{ user.ativo ? 'Inativar' : 'Ativar' }}
                    </button>
                    <button 
                      (click)="deleteUser(user.id)"
                      class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      [disabled]="user.role === 'admin'">
                      Remover
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-6 py-8 text-center text-gray-500">Nenhum usuário encontrado na plataforma.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  private adminService = inject(AdminService);
  
  users = signal<AuthUserDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Erro ao carregar usuários. O backend está rodando e você é admin?');
        this.loading.set(false);
      }
    });
  }

  toggleStatus(user: AuthUserDto) {
    if (user.role === 'admin') return;

    const novoStatus = !user.ativo;
    this.adminService.updateUserStatus(user.id, novoStatus).subscribe({
      next: (updatedUser) => {
        this.users.update(list => list.map(u => u.id === updatedUser.id ? updatedUser : u));
      },
      error: (err) => {
        alert('Erro ao atualizar o status do usuário.');
      }
    });
  }

  deleteUser(id: number) {
    if (confirm('Tem certeza que deseja remover este usuário? Esta ação é irreversível.')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.users.update(list => list.filter(u => u.id !== id));
        },
        error: (err) => {
          alert('Erro ao remover o usuário.');
        }
      });
    }
  }
}
