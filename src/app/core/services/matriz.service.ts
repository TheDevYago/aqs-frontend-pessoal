import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Matriz } from '../models/matriz.model';

@Injectable({
  providedIn: 'root',
})

export class MatrizService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/matriz`;

  listarTodos() {
    return this.http.get<Matriz[]>(this.API);
  }
  buscarPorId(id: number) {
    return this.http.get<Matriz>(`${this.API}/${id}`);
  }
  salvar(matriz: any) {
    return this.http.post<Matriz>(this.API, matriz);
  }
  atualizar(id: number, matriz: any) {
    return this.http.put<Matriz>(`${this.API}/${matriz.id}`, matriz);
  }
  inativar (id:number) {
    return this.http.patch(`${this.API}/${id}/inativar`, {})
  }
  reativar(id: number) {
    return this.http.patch(`${this.API}/${id}/reativar`, {});
  }
  vincularDisciplinas(matrizId: number, disciplinasIds: number[]) {
    return this.http.post(`${this.API}/${matrizId}/disciplinas`, disciplinasIds);
  }

}
