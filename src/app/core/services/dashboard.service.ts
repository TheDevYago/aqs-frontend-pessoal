import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/dashboard`;

  obterResumo() {
    return this.http.get<any>(this.API);
  }
}
