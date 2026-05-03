import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MonitoriaService } from '../../../core/services/monitoria.service';
import { ResultadoService } from '../../../core/services/resultado.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { ToastServ } from '../../../core/services/toast.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private monitoriaServ = inject(MonitoriaService);
  private resultadoServ = inject(ResultadoService);
  private professorServ = inject(ProfessorService);
  private toastService = inject(ToastServ);


  private idProfessorLogado = 1;

  nomeProfessor: string = 'Carregando...';

  estatistica = [
    { titulo: 'Monitores Ativos', valor: '0', corFundo: 'bg-blue-50', corTexto: 'text-blue-600', iconePath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { titulo: 'Disciplinas', valor: '0', corFundo: 'bg-emerald-50', corTexto: 'text-emerald-600', iconePath: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
    { titulo: 'Monitorias Concluídas', valor: '0', corFundo: 'bg-purple-50', corTexto: 'text-purple-600', iconePath: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { titulo: 'Em Andamento', valor: '0', corFundo: 'bg-orange-50', corTexto: 'text-orange-500', iconePath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  monitoresAtivos: any[] = [];
  minhasDisciplinas: any[] = [];
  atividades: any[] = [];

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    forkJoin({
      perfil: this.professorServ.buscarPorId(this.idProfessorLogado),
      monitorias: this.monitoriaServ.listarTodas(),
      resultados: this.resultadoServ.listarTodos()
    }).subscribe({
      next: (res) => {
        this.nomeProfessor = res.perfil.nome;
        
        const ativas = res.monitorias.filter(m => m.status === 'Ativo');
        this.monitoresAtivos = ativas.slice(0, 5);

        const nomesDisciplinas = [...new Set(res.monitorias.map(m => m.disciplina))];
        this.minhasDisciplinas = nomesDisciplinas.map(nome => ({
          nome,
          totalMonitores: res.monitorias.filter(m => m.disciplina === nome).length
        }));

        this.estatistica[0].valor = ativas.length.toString();
        this.estatistica[1].valor = nomesDisciplinas.length.toString();
        this.estatistica[2].valor = res.resultados.length.toString();
        this.estatistica[3].valor = ativas.filter(m => m.tipo === 'Presencial').length.toString();

        this.gerarAtividades(ativas, res.resultados);
      },
      error: () => this.toastService.exibir('Erro ao carregar dados do Dashboard', 'aviso')
    });
  }

  private gerarAtividades(monitorias: any[], resultados: any[]) {
    this.atividades = [];

    monitorias.forEach(m => {
      const jaLancado = resultados.find(r => r.matricula === m.matricula);
      if (!jaLancado) {
        this.atividades.push({
          titulo: 'Lançar Resultados da Monitoria',
          subtitulo: `${m.nome || m.monitor} - ${m.disciplina}`,
          tempo: 'Pendente',
          corBolinha: 'bg-red-500'
        });
      }
    });

    if (this.atividades.length === 0) {
      this.atividades.push({
        titulo: 'Tudo em dia!',
        subtitulo: 'Nenhuma ação pendente no momento.',
        tempo: 'Agora',
        corBolinha: 'bg-emerald-500'
      });
    }
  }
}