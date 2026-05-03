import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FechamentoService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/fechamento`;

  encerrarSemestreCorrente() {
    return this.http.post(`${this.API}/encerrar`, {});
  }
}
