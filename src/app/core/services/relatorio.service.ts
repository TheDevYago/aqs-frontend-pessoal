import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RelatorioService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/relatorios`;

  baixarRelatorio(tipoId: number, formato: string, filtros: any) {
    let params = new HttpParams();
    if (filtros.inicio) params = params.set('dataInicio', filtros.inicio);
    if (filtros.fim) params = params.set('dataFim', filtros.fim);
    if (filtros.semestre) params = params.set('semestre', filtros.semestre);
    params = params.set('formato', formato);

    return this.http.get(`${this.API}/${tipoId}`, { params, responseType: 'blob' });
  }
}
