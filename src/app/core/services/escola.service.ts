import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of, tap } from 'rxjs';
import { Escola } from '../models/escola.model';

@Injectable({
  providedIn: 'root',
})
export class EscolaService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/escola`;
  private cacheEscolas: Escola[] | null = null;

  listarTodas(): Observable<Escola[]> {
    if (this.cacheEscolas) return of(this.cacheEscolas);
    return this.http.get<Escola[]>(this.API).pipe(
      tap(dados => this.cacheEscolas = dados)
    );
  }

  listarPorId(id: number) {
    return this.http.get<Escola>(`${this.API}/${id}`);
  }

  salvar(escola: any): Observable<Escola> {
    this.limparCache();
    return this.http.post<Escola>(this.API, escola);
  }

  atualizar(id: number, escola: any): Observable<any> {
    this.limparCache();
    return this.http.put(`${this.API}/${id}`, escola); 
  }

  inativar(id: number): Observable<any> {
    this.limparCache();
    return this.http.patch(`${this.API}/${id}/inativar`, {});
  }

  reativar (id: number): Observable<void> {
    this.limparCache();
    return this.http.patch<void>(`${this.API}/${id}/reativar`, {});
  }

  private limparCache() {
    this.cacheEscolas = null;
  }
}