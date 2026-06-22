import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LuthierDto, CreateLuthierDto, UpdateLuthierDto } from '@luthiers/utils';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LuthierService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/luthiers`;

  getAll(): Observable<LuthierDto[]> {
    return this.http.get<LuthierDto[]>(this.apiUrl);
  }

  getById(id: string): Observable<LuthierDto> {
    return this.http.get<LuthierDto>(`${this.apiUrl}/${id}`);
  }

  create(data: CreateLuthierDto): Observable<LuthierDto> {
    return this.http.post<LuthierDto>(this.apiUrl, data);
  }

  update(id: string, data: UpdateLuthierDto): Observable<LuthierDto> {
    return this.http.put<LuthierDto>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
