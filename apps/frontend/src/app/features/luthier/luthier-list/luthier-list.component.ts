import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LuthierDto } from '@luthiers/utils';
import { LuthierService } from '../services/luthier.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-luthier-list',
  standalone: true,
  imports: [DatePipe, RouterLink, FormsModule],
  templateUrl: './luthier-list.component.html'
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

  searchTerm: string = '';

  get filteredItems() {
    if (!this.searchTerm) return this.data();
    const term = this.searchTerm.toLowerCase();
    return this.data().filter(luthier => luthier.nomeMestre?.toLowerCase().startsWith(term));
  }

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
