import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Matriz } from '../models/matriz.model';

@Injectable({
  providedIn: 'root',
})

export class MatrizService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/matrizes`;

  listarTodos() {
    return this.http.get<Matriz[]>(this.API);
  }
  buscarPorId(id: number) {
    return this.http.get<Matriz>(`${this.API}/${id}`);
  }
  salvar(matriz: Matriz) {
    return this.http.post<Matriz>(this.API, matriz);
  }
  atualizar(matriz: Matriz) {
    return this.http.put<Matriz>(`${this.API}/${matriz.id}`, matriz);
  }
}
