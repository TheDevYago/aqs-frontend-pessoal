import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Curso } from '../models/curso.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CursoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/curso`;

  listarTodos() {
    return this.http.get<Curso[]>(this.API);
  }
  listarPorId(id: number) {
    return this.http.get<Curso>(`${this.API}/${id}`);
  }
  salvar(curso: any): Observable<any> {
    return this.http.post<any>(this.API, curso);
  }
  atualizar(curso: Curso) {
    return this.http.put<Curso>(`${this.API}/${curso.id}`, curso);
  }
  inativar(id: number) {
    return this.http.patch(`${this.API}/${id}/inativar`, {});
  }
}
