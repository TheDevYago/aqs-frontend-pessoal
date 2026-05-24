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
        this.carregando = false;

        // Pega o usuário REAIS que o Java acabou de devolver e salvar no localStorage
        const usuarioReal = this.authServ.getUsuarioLogado();

        // Faz uma validação extra: O botão que ele clicou bate com a realidade?
        if (this.perfilSelecionado === 'Administrador' && usuarioReal?.role !== 'ADMIN') {
          this.toastService.exibir('Credenciais inválidas para Administrador', 'erro');
          this.authServ.logout(); // Expulsa
          return;
        }
        if (this.perfilSelecionado === 'Professor' && usuarioReal?.role !== 'USER') {
          this.toastService.exibir('Credenciais inválidas para Professor', 'erro');
          this.authServ.logout(); // Expulsa
          return;
        }

        this.toastService.exibir('Login realizado com sucesso!', 'sucesso');

        // A ROTA AGORA É DECIDIDA PELO BANCO DE DADOS, NÃO PELO BOTÃO!
        const rota = usuarioReal?.role === 'ADMIN' ? '/admin/dashboard' : '/professor/dashboard';

        this.router.navigateByUrl(rota).catch(err => {
          console.error('Erro de rota:', err);
        });
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro no login:', err);
        this.toastService.exibir('Usuário ou senha inválidos', 'erro');
      }
    });
  }
}
