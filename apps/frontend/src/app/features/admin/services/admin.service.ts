import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUserDto } from '@luthiers/utils';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`;

  getUsers(): Observable<AuthUserDto[]> {
    return this.http.get<AuthUserDto[]>(this.apiUrl);
  }

  updateUserStatus(id: number, ativo: boolean): Observable<AuthUserDto> {
    return this.http.put<AuthUserDto>(`${this.apiUrl}/${id}`, { ativo });
  }

  deleteUser(id: number): Observable<{ mensagem: string }> {
    return this.http.delete<{ mensagem: string }>(`${this.apiUrl}/${id}`);
  }
}
