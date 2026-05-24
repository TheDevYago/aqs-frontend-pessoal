import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Resultado } from '../models/resultado.model';

@Injectable({
  providedIn: 'root',
})
export class ResultadoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/resultados`;

  listarTodos() {
    return this.http.get<Resultado[]>(this.API);
  }
  obterPorId(id: number) {
    return this.http.get<Resultado>(`${this.API}/${id}`);
  }
  salvar(resultado: Resultado) {
    return this.http.post<Resultado>(this.API, resultado);
  }
  atualizar(resultado: Resultado){
    return this.http.put<Resultado>(`${this.API}/${resultado.id}`, resultado);
  }
  excluir(id: number){
    return this.http.delete(`${this.API}/${id}`);
  }
  listarPorProfessor(matricula: number) {
    return this.http.get<Resultado[]>(`${this.API}/professor/${matricula}`);
  }

}
