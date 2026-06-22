import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUserDto } from '@luthiers/utils';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getAll(): Observable<AuthUserDto[]> {
    return this.http.get<AuthUserDto[]>(this.apiUrl);
  }

  toggleActive(id: number, ativo: boolean): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, { ativo });
  }

  deleteUser(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
