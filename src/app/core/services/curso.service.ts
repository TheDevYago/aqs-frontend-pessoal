import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Curso } from '../models/curso.model';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CursoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/curso`;
  private cacheCursos: Curso[] | null = null;

  listarTodos() {
    if (this.cacheCursos) return of(this.cacheCursos);
    return this.http.get<Curso[]>(this.API).pipe(tap(dados => this.cacheCursos = dados));
  }
  listarPorId(id: number) {
    return this.http.get<Curso>(`${this.API}/${id}`);
  }
  salvar(curso: any): Observable<any> {
    this.limparCache();
    return this.http.post<any>(this.API, curso);
  }
  atualizar(curso: Curso) {
    this.limparCache();
    return this.http.put<Curso>(`${this.API}/${curso.id}`, curso);
  }
  inativar(id: number) {
    this.limparCache();
    return this.http.patch(`${this.API}/${id}/inativar`, {});
  }
  reativar(id:number): Observable<void> {
    this.limparCache();
    return this.http.patch<void>(`${this.API}/${id}/reativar`, {});
  }

  limparCache(){
    this.cacheCursos = null;
  }
}
