import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Disciplina } from '../models/disciplina.model';

@Injectable({
  providedIn: 'root',
})

export class DisciplinaService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/disciplinas`;

  listarTodas() {
    return this.http.get<Disciplina[]>(this.API);
  }
  listarPorId(id: number) {
    return this.http.get<Disciplina>(`${this.API}/${id}`);
  }
  salvar(disciplina: Disciplina) {
    return this.http.post<Disciplina>(this.API, disciplina)
  }
  atualizar(disciplina: Disciplina) {
    return this.http.put<Disciplina>(`${this.API}/${disciplina.id}`, disciplina);
  }

  inativar(id: number) {
    return this.http.patch(`${this.API}/${id}/inativar`, {});
  }
}
