import { CommonModule } from '@angular/common';
import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastServ } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ProjetoAQS-Front');
  toastServ = inject(ToastServ)
}
