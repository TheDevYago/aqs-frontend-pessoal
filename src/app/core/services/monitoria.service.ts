import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Monitoria } from '../models/monitoria.model';

@Injectable({
  providedIn: 'root',
})
export class MonitoriaService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/monitorias`;

  listarTodas() {
    return this.http.get<Monitoria[]>(this.API);
  }

  listarPorId(id: number) {
    return this.http.get<Monitoria>(`${this.API}/${id}`);
  }

  salvar(monitoria: Monitoria) {
    return this.http.post<Monitoria>(this.API, monitoria);
  }

  atualizar(monitoria: Monitoria){
    return this.http.put<Monitoria>(`${this.API}/${monitoria.id}`, monitoria);
  }

  excluir(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  buscarPorProfessor(matricula: number) {
    return this.http.get<any[]>(`${this.API}/professor/${matricula}`);
  }
}
