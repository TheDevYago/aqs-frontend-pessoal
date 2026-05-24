import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastServ } from '../services/toast.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastServ);

  const usuario = authService.getUsuarioLogado();

  // 1. Se não tiver ninguém logado, chuta para o login
  if (!usuario) {
    toastService.exibir('Acesso negado. Faça login.', 'aviso');
    router.navigate(['/login']);
    return false;
  }

  // 2. Descobre qual é a role exigida para entrar nesta rota (vamos configurar isso no app.routes.ts)
  const roleExigida = route.data['roleEsperada'];

  // 3. Se a rota exige uma role específica e o usuário NÃO tem ela
  if (roleExigida && usuario.role !== roleExigida) {
    toastService.exibir('Área restrita! Você não tem permissão.', 'erro');

    // Redireciona o penetra de volta para a área certa dele
    if (usuario.role === 'ADMIN') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/professor/dashboard']);
    }
    return false;
  }

  // 4. Se chegou aqui, o crachá está certo. Pode entrar!
  return true;
};
