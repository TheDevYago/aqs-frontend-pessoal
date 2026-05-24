import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { ResultadoService } from '../../../core/services/resultado.service';
import {MonitoriaService} from '../../../core/services/monitoria.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
  private monitorServ = inject(MonitoriaService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private router = inject(Router);

  private matriculaProfessorLogado!: number;

  resumo = {
    totalMonitorias: 0,
    alunosAtendidos: 0,
    disciplinas: 0
  };

  tBusca: string = '';

  historico: any[] = [];
  historicoFiltrado: any[] = [];

  ngOnInit() {
    const usuario = this.authService.getUsuarioLogado();
    if (usuario && usuario.matriculaProfessor) {
      this.matriculaProfessorLogado = usuario.matriculaProfessor;
      this.carregarDados();
    } else {
      this.toastService.exibir('Sessão expirada.', 'aviso');
      this.router.navigate(['/login']);
    }
  }

  carregarDados(){
    // 1. Busca primeiro os resultados
    this.resultadoServ.listarPorProfessor(this.matriculaProfessorLogado).subscribe({
      next: (resultados) => {
        // 2. Busca pelas monitorias do professor logado
        this.monitorServ.buscarPorProfessor(this.matriculaProfessorLogado).subscribe({
          next: (monitorias: any[]) => {

            // 3. A MÁGICA: Cruza os dados das duas tabelas
            this.historico = monitorias.map(m => {
              // Procura se existe um resultado lançado para a monitoria atual
              const resultadoLancado = resultados.find(r => r.idMonitoria === m.id);

              return {
                id: m.id,
                matricula: m.alunoMatricula?.toString(),
                monitor: m.alunoNome || 'Sem Nome',
                disciplina: m.disciplinaNome || 'Não Atribuída',
                semestre: m.semestre || '',
                tipo: m.tipoMonitoria || 'Presencial',
                periodo: `${m.dataInicio} até ${m.dataFim}`,
                alunos: m.alunos || 0,
                // Se achou o resultado, coloca Aprovado/Reprovado. Se não, está Em Andamento!
                parecer: resultadoLancado ? resultadoLancado.parecer : 'Em Andamento'
              };
            });

            this.atualizarResumo();
            this.filtrarHistorico();
            this.cdr.detectChanges(); // Atualiza a tela imediatamente
          },
          error: () => this.toastService.exibir('Erro ao carregar monitorias', 'aviso')
        });
      },
      error: () => this.toastService.exibir('Erro ao carregar resultados do histórico', 'aviso')
    });
  }

  filtrarHistorico() {
    if (this.tBusca.trim() === '') {
      this.historicoFiltrado = [...this.historico];
    } else {
      const termo = this.tBusca.toLowerCase();
      this.historicoFiltrado = this.historico.filter(h =>
        (h.monitor && h.monitor.toLowerCase().includes(termo)) ||
        (h.disciplina && h.disciplina.toLowerCase().includes(termo)) ||
        (h.matricula && h.matricula.includes(termo))
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
