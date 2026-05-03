import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastServ } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  private toastService = inject(ToastServ);
  private authServ = inject(AuthService);
  private router = inject(Router);

  email: string = '';
  senha: string = '';
  perfilSelecionado: string = 'Administrador'

  mostrarSenha: boolean = false;
  carregando: boolean = false;

  selecionarPerfil(perfil: string){
    this.perfilSelecionado = perfil;
  }

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  fazerLogin() {
    if (this.email.trim() === '' || this.senha.trim() === '') {
      this.toastService.exibir('Por favor, preencha seu email e senha', 'erro');
      return;
    }

    this.carregando = true; // O botão começa a carregar

    const credenciais = {
      login: this.email,
      password: this.senha
    };

    this.authServ.login(credenciais).subscribe({
      next: (res) => {
        // 1. DESTRAVA O BOTÃO NO INÍCIO DO SUCESSO
        this.carregando = false;
        this.toastService.exibir('Login realizado com sucesso!', 'sucesso');

        // 2. NAVEGAÇÃO SEGURA (Usando navigateByUrl para evitar erros de segmento)
        const rota = this.perfilSelecionado === 'Administrador' ? '/admin/dashboard' : '/professor/dashboard';
      
        this.router.navigateByUrl(rota).catch(err => {
          console.error('Erro de rota:', err);
        // Se a rota falhar, o console vai dizer exatamente o porquê
        });
      },
      error: (err) => {
        // 3. DESTRAVA O BOTÃO SE O LOGIN FALHAR
        this.carregando = false; 
        console.error('Erro no login:', err);
        this.toastService.exibir('Usuário ou senha inválidos', 'erro');
      }
    });
  }
}
