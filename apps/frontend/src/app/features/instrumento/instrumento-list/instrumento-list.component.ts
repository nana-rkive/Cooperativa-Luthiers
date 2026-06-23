import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InstrumentoDto, LuthierDto } from '@luthiers/utils';
import { InstrumentoService } from '../services/instrumento.service';
import { AuthService } from '../../auth/services/auth.service';
import { LuthierService } from '../../luthier/services/luthier.service';

@Component({
  selector: 'app-instrumento-list',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, RouterLink, FormsModule],
  templateUrl: './instrumento-list.component.html'
})
export class InstrumentoListComponent implements OnInit {
  private instrumentoService = inject(InstrumentoService);
  private luthierService = inject(LuthierService);
  authService = inject(AuthService);
 
  data = signal<InstrumentoDto[]>([]);
  luthiersList = signal<LuthierDto[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);
  deleteError = signal<string | null>(null);
  
  isEmpty = computed(() => this.data().length === 0);
 
  itemToDelete = signal<InstrumentoDto | null>(null);
  deleting = signal<boolean>(false);
 
  searchTerm: string = '';

  get filteredItems() {
    if (!this.searchTerm) return this.data();
    const term = this.searchTerm.toLowerCase();
    return this.data().filter(item => item.modeloMadeira?.toLowerCase().startsWith(term));
  }

  ngOnInit(): void {
    this.loadLuthiers();
    this.loadInstrumentos();
  }

  getLuthierName(luthierId: number): string {
    const luthier = this.luthiersList().find(l => Number(l.id) === Number(luthierId));
    return luthier ? luthier.nomeMestre : `ID: ${luthierId}`;
  }

  loadLuthiers(): void {
    this.luthierService.getAll().subscribe({
      next: (luthiers) => {
        this.luthiersList.set(luthiers);
      }
    });
  }

  loadInstrumentos(): void {
    this.loading.set(true);
    this.error.set(null);
    this.deleteError.set(null);
    
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
    this.deleteError.set(null);
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
    this.deleteError.set(null);
    this.instrumentoService.delete(target.id).subscribe({
      next: () => {
        this.data.update(list => list.filter(item => item.id !== target.id));
        this.deleting.set(false);
        this.itemToDelete.set(null);
      },
      error: () => {
        this.deleting.set(false);
        this.itemToDelete.set(null);
        this.deleteError.set('Não foi possível excluir o instrumento selecionado.');
      }
    });
  }
}
