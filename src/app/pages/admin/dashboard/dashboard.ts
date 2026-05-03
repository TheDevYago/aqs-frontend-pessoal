import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscolaService } from '../../../core/services/escola.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { CursoService } from '../../../core/services/curso.service';
import { MonitoriaService } from '../../../core/services/monitoria.service';
import { ToastServ } from '../../../core/services/toast.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private escolaServ = inject(EscolaService)
  private professorServ = inject(ProfessorService);
  private cursoServ = inject(CursoService);
  private monitoriaServ = inject(MonitoriaService);
  private toastService = inject(ToastServ);


  totalEscolasAtivas: number = 0;
  totalProfessores: number = 0;
  totalCursos: number = 0;
  totalMonitores: number = 0;

  //arrays vazios para dados
  monitorias: any[] = [];
  atividades: any[] = [];

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    forkJoin ({
      escolas: this.escolaServ.listarTodas(),
      professores: this.professorServ.listarTodos(),
      cursos: this.cursoServ.listarTodos(),
      monitoriasList: this.monitoriaServ.listarTodas()
    }).subscribe ({
      next: (resultados) => {
        this.totalEscolasAtivas = resultados.escolas.filter(e => e.status === 'Ativo').length;
        this.totalProfessores = resultados.professores.length;
        this.totalCursos = resultados.cursos.length;

        const ativas = resultados.monitoriasList.filter(m => m.status === 'Ativo');
        this.totalMonitores = ativas.length;

        this.monitorias = ativas.slice(0, 3).map(m => ({
          disciplina: m.disciplina,
          monitor: m.nome,
          alunos: m.alunos || 0
        }));

        this.atividades = [];

        if(resultados.escolas.length > 0) {
          const ultimaEscola = resultados.escolas[resultados.escolas.length - 1];
          this.atividades.push({
            titulo: 'Última Escola Cadastrada',
            descricao: ultimaEscola.nome,
            tempo: 'Recente'
          });
        }

        if (ativas.length > 0) {
          const ultimoMonitor = ativas[ativas.length - 1];
          this.atividades.push({
            titulo: 'Novo Monitor Ativo',
            descricao: `${ultimoMonitor.nome} - ${ultimoMonitor.disciplina}`,
            tempo: 'Recente'
          });
        }

        this.atividades.push({
          titulo: 'Sincronização de Banco',
          descricao: 'Os dados do dashboard estão sincronizados com a API em tempo real.',
          tempo: 'Agora'
        });
      },
      error: () => this.toastService.exibir('Erro ao carregar dados do Dashboard', 'aviso')
    });
  }
}
