import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from './services/usuario.service';
import { AuthUserDto } from '@luthiers/utils';
import { parseAuthError } from '../../core/utils/auth-error.util';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [NgClass, RouterLink, FormsModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  private usuarioService = inject(UsuarioService);

  data = signal<AuthUserDto[]>([]);
  loading = signal<boolean>(true);
  initialError = signal<string | null>(null);
  globalError = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  isEmpty = computed(() => this.data().length === 0);
  togglingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);
  
  showDeleteModal = signal<boolean>(false);
  userToDelete = signal<AuthUserDto | null>(null);

  showToggleModal = signal<boolean>(false);
  userToToggle = signal<AuthUserDto | null>(null);

  searchTerm: string = '';

  get filteredUsers() {
    if (!this.searchTerm) return this.data();
    const term = this.searchTerm.toLowerCase();
    return this.data().filter(user => user.primeiroNome?.toLowerCase().startsWith(term));
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.initialError.set(null);
    this.globalError.set(null);
    this.successMessage.set(null);
    
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

  openToggleModal(user: AuthUserDto): void {
    this.userToToggle.set(user);
    this.showToggleModal.set(true);
  }

  closeToggleModal(): void {
    if (this.togglingId() !== null) return;
    this.showToggleModal.set(false);
    this.userToToggle.set(null);
  }

  activateUser(user: AuthUserDto): void {
    if (this.togglingId() !== null) return;
    
    this.togglingId.set(user.id);
    this.globalError.set(null);
    this.successMessage.set(null);

    this.usuarioService.toggleActive(user.id, true).subscribe({
      next: () => {
        this.data.update(list => 
          list.map(u => u.id === user.id ? { ...u, ativo: true } : u)
        );
        this.successMessage.set(`Usuário ${user.primeiroNome || ''} ativado com sucesso!`);
        this.togglingId.set(null);
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        const parsed = parseAuthError(err);
        this.globalError.set(parsed['global'] || 'Erro desconhecido ao ativar o usuário.');
        this.togglingId.set(null);
      }
    });
  }

  confirmToggle(): void {
    const user = this.userToToggle();
    if (!user) return;
    if (this.togglingId() !== null) return;
    
    this.togglingId.set(user.id);
    this.globalError.set(null);
    this.successMessage.set(null);

    const newStatus = !user.ativo;

    this.usuarioService.toggleActive(user.id, newStatus).subscribe({
      next: () => {
        this.data.update(list => 
          list.map(u => u.id === user.id ? { ...u, ativo: newStatus } : u)
        );
        this.successMessage.set(`Usuário ${user.primeiroNome || ''} ${newStatus ? 'ativado' : 'desativado'} com sucesso!`);
        this.togglingId.set(null);
        this.closeToggleModal();
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        const parsed = parseAuthError(err);
        this.globalError.set(parsed['global'] || 'Erro desconhecido ao alterar status do usuário.');
        this.togglingId.set(null);
        this.closeToggleModal();
      }
    });
  }

  openDeleteModal(user: AuthUserDto): void {
    this.userToDelete.set(user);
    this.showDeleteModal.set(true);
  }

  closeModal(): void {
    if (this.deletingId() !== null) return;
    this.showDeleteModal.set(false);
    this.userToDelete.set(null);
  }

  confirmDelete(): void {
    const user = this.userToDelete();
    if (!user) return;
    if (this.deletingId() !== null) return;
    
    this.deletingId.set(user.id);
    this.globalError.set(null);
    this.successMessage.set(null);

    this.usuarioService.deleteUser(user.id).subscribe({
      next: () => {
        this.data.update(list => list.filter(u => u.id !== user.id));
        this.successMessage.set(`Usuário ${user.primeiroNome || ''} excluído com sucesso!`);
        this.deletingId.set(null);
        this.closeModal();
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        const parsed = parseAuthError(err);
        this.globalError.set(parsed['global'] || 'Erro desconhecido ao excluir usuário.');
        this.deletingId.set(null);
        this.closeModal();
      }
    });
  }
}
