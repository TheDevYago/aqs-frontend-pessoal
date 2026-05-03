import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { ResultadoService } from '../../../core/services/resultado.service';

@Component({
  selector: 'app-historico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historico.html',
  styleUrl: './historico.css',
})
export class Historico implements OnInit {
  private toastService = inject(ToastServ);
  private resultadoServ = inject(ResultadoService);


  resumo = {
    totalMonitorias: 0,
    alunosAtendidos: 0,
    disciplinas: 0
  };
  
  tBusca: string = '';

  historico: any[] = [];
  historicoFiltrado: any[] = [];
  
  ngOnInit() {
    this.carregarDados();
  }

  carregarDados(){
    this.resultadoServ.listarTodos().subscribe({
      next: (dados) => {
        this.historico = dados;
        this.atualizarResumo();
        this.filtrarHistorico();
      },
      error: () => this.toastService.exibir('Erro ao carregar o histórico', 'aviso')
    });
  }

  filtrarHistorico() {
    if (this.tBusca.trim() === '') {
      this.historicoFiltrado = [...this.historico];
    } else {
      const termo = this.tBusca.toLowerCase();
      this.historicoFiltrado = this.historico.filter(h => 
        (h.monitor && h.monitor.toLowerCase().includes(termo)) ||
        (h.disciplina && h.disciplina.toLowerCase().includes(termo)) || (h.matricula && h.matricula.includes(termo))
      );
    }
  }

  atualizarResumo() {
    this.resumo.totalMonitorias = this.historico.length;
    this.resumo.alunosAtendidos = this.historico.reduce((total, item) => total + (item.alunos || 0), 0);
    const disciplinasUnicas = new Set(this.historico.map(item => item.disciplina));
    this.resumo.disciplinas = disciplinasUnicas.size;
  }

  
}
