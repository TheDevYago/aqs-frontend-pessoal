import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboard.service';
import { ToastServ } from '../../../core/services/toast.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardServ = inject(DashboardService);
  private toastService = inject(ToastServ);
  private cdr = inject(ChangeDetectorRef);

  totalEscolasAtivas: number = 0;
  totalProfessores: number = 0;
  totalCursos: number = 0;
  totalMonitores: number = 0;


  monitorias: any[] = [];
  atividades: any[] = [];

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.dashboardServ.obterResumo().subscribe({
      next: (dados: any) => {
        this.totalEscolasAtivas = dados.totalEscolasAtivas;
        this.totalProfessores = dados.totalProfessores;
        this.totalCursos = dados.totalCursos;
        this.totalMonitores = dados.totalMonitores;
        this.monitorias = dados.monitorias;
        this.atividades = dados.atividades;

        this.cdr.detectChanges();
      },
      error: () => this.toastService.exibir('Erro ao carregar dados do Dashboard', 'aviso')
    });
  }
}
