import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InstrumentoDto, CreateInstrumentoDto, UpdateInstrumentoDto } from '@luthiers/utils';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InstrumentoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/instrumentos`;

  getAll(): Observable<InstrumentoDto[]> {
    return this.http.get<InstrumentoDto[]>(this.apiUrl);
  }

  getById(id: number): Observable<InstrumentoDto> {
    return this.http.get<InstrumentoDto>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateInstrumentoDto): Observable<InstrumentoDto> {
    return this.http.post<InstrumentoDto>(this.apiUrl, data);
  }

  update(id: number, data: UpdateInstrumentoDto): Observable<InstrumentoDto> {
    return this.http.patch<InstrumentoDto>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
