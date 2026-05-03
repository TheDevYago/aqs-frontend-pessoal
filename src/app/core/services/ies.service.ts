import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { Ies } from '../models/ies.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class IesService {
  private readonly API = `${environment.apiUrl}/ies`;
  private cacheIes: Ies[] | null = null;
  
  constructor(private http: HttpClient){}

  listarTodas(): Observable<Ies[]> {
    if (this.cacheIes) {
      return of(this.cacheIes);
    }
    return this.http.get<Ies[]>(this.API).pipe(
      tap(dados=> this.cacheIes = dados)
    )
  }
  buscarPorId(id: number): Observable<Ies> {
    if (this.cacheIes) {
      const ies = this.cacheIes.find(i => i.id === id);
      if (ies) {
        return of(ies);
      }
    }
    return this.http.get<Ies>(`${this.API}/${id}`);
  }
  salvar(ies: Ies): Observable<Ies> {
    this.limparCache();
    return this.http.post<Ies>(this.API, ies);
  }
  atualizar(ies: Ies): Observable<Ies> {
    this.limparCache();
    return this.http.put<Ies>(`${this.API}/${ies.id}`, ies);
  }

  inativar(id: number): Observable<any> {
    this.limparCache();
    return this.http.patch(this.API + '/' + id + '/inativar', {});  
  }

  limparCache() {
    this.cacheIes = null;
  }
}
