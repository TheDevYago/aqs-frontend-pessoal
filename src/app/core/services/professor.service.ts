import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Professor } from '../models/professor.model';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProfessorService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/professor`;
  private cacheProfessores: Professor[] | null = null;

  listarTodos() {
    if (this.cacheProfessores) {
      return of(this.cacheProfessores);
    }
    return this.http.get<Professor[]>(this.API).pipe(
      tap(dados => this.cacheProfessores = dados)
    );
  }
  salvar(professor: any) {
    this.limparCache();
    return this.http.post<Professor>(this.API, professor);
  }
  atualizar(matricula: number, professor: any): Observable<Professor> {
    this.limparCache();
    return this.http.put<Professor>(`${this.API}/${matricula}`, professor);
  }

  inativar(matricula: number) {
    this.limparCache();
    return this.http.patch(`${this.API}/${matricula}/inativar`, {});
  }

  reativar(matricula:number) {
    this.limparCache();
    return this.http.patch<void>(`${this.API}/${matricula}/reativar`, {});
  }

  buscarPorId(id: number) {
    return this.http.get<Professor>(`${this.API}/${id}`);
  }
  uploadFoto(id: number, arquivo: File){
    const formData = new FormData();
    formData.append('foto', arquivo) // tem q bater com o RequestParam
    return this.http.post(`${this.API}/${id}/foto`, formData);
  }

  limparCache() {
    this.cacheProfessores = null;
  }
}
