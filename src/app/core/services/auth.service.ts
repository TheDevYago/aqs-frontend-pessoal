import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';
import { AuthResponse, Login } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/auth`;

  login(credenciais: Login) {
    return this.http.post<AuthResponse>(`${this.API}/login`, credenciais).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);

          if (response.usuarioDTO) {
            localStorage.setItem('usuario', JSON.stringify(response.usuarioDTO));
          }
        }
      })
    );
  }

  logout() {
    localStorage.clear();
  }

}
