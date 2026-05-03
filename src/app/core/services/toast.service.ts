import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  mensagem: string;
  tipo: 'sucesso' | 'erro' | 'aviso';
}

@Injectable({
  providedIn: 'root',
})

export class ToastServ {
  private toastSubject = new Subject<Toast | null>();
  toastState$ = this.toastSubject.asObservable();

  exibir(mensagem: string, tipo: 'sucesso' | 'erro' | 'aviso' = 'sucesso') {
    this.toastSubject.next({ mensagem, tipo});
    setTimeout(() => {
      this.toastSubject.next(null);
    }, 3000);
  }
}
