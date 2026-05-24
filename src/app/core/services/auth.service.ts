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

          // Ajustado de usuarioDTO para usuario
          if (response.usuario) {
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
          }
        }
      })
    );
  }

  logout() {
    localStorage.clear();
  }

  getUsuarioLogado(): any {
    const userJson = localStorage.getItem('usuario');
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLogado(): boolean {
    return !!this.getToken();
  }
}
