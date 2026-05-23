import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MonitoriaService } from '../../../core/services/monitoria.service';
import { ResultadoService } from '../../../core/services/resultado.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { ToastServ } from '../../../core/services/toast.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private monitoriaServ = inject(MonitoriaService);
  private resultadoServ = inject(ResultadoService);
  private professorServ = inject(ProfessorService);
  private toastService = inject(ToastServ);
  private cdr = inject(ChangeDetectorRef);

  private matriculaProfessorLogado = 10002;

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
      // CORREÇÃO: Usa 'nome' e cast para 'any' para evitar erros de tipagem
      perfil: this.professorServ.buscarPorId(this.matriculaProfessorLogado).pipe(
        catchError(err => {
          console.warn('Endpoint de professor não encontrado. Usando nome padrão.', err);
          return of({ nome: 'Pedro' } as any);
        })
      ),
      monitorias: this.monitoriaServ.buscarPorProfessor(this.matriculaProfessorLogado).pipe(
        catchError(err => {
          console.error('Erro ao buscar monitorias:', err);
          return of([]);
        })
      ),
      resultados: this.resultadoServ.listarTodos().pipe(
        catchError(err => {
          console.error('Erro ao buscar resultados:', err);
          return of([]);
        })
      )
    }).subscribe({
      next: (res) => {
        // O TypeScript agora aceita o 'nome' sem problemas
        const perfil: any = res.perfil;
        this.nomeProfessor = perfil?.nome ? perfil.nome.split(' ')[0] : 'Professor';

        const ativas = res.monitorias.filter((m: any) => m.status === true);

        this.monitoresAtivos = ativas.slice(0, 5).map((m: any) => ({
          matricula: m.alunoMatricula,
          nome: m.alunoNome || 'Aluno',
          disciplina: m.disciplinaNome || 'Disciplina não informada',
          alunos: m.alunos || 0
        }));

        const nomesDisciplinas = [...new Set(res.monitorias.map((m: any) => m.disciplinaNome))].filter(n => n);
        this.minhasDisciplinas = nomesDisciplinas.map((nome: any) => ({
          nome,
          codigo: 'AQS-2026',
          ch: '80h',
          totalMonitores: res.monitorias.filter((m: any) => m.disciplinaNome === nome).length
        }));

        this.estatistica[0].valor = ativas.length.toString();
        this.estatistica[1].valor = nomesDisciplinas.length.toString();
        this.estatistica[2].valor = res.resultados.length.toString();
        this.estatistica[3].valor = (ativas.length - res.resultados.length).toString();

        this.gerarAtividades(ativas, res.resultados);
        this.cdr.detectChanges();
      }
    });
  }

  private gerarAtividades(monitoriasAtivas: any[], resultados: any[]) {
    this.atividades = [];

    monitoriasAtivas.forEach(m => {
      const jaLancado = resultados.find(r => r.idMonitoria === m.id);

      if (!jaLancado) {
        this.atividades.push({
          titulo: 'Lançar Parecer Final',
          subtitulo: `${m.alunoNome} - ${m.disciplinaNome}`,
          tempo: 'Pendente',
          corBolinha: 'bg-red-500'
        });
      }
    });

    if (this.atividades.length === 0) {
      this.atividades.push({
        titulo: 'Tudo em dia!',
        subtitulo: 'Nenhuma atividade pendente.',
        tempo: 'Agora',
        corBolinha: 'bg-emerald-500'
      });
    }
  }
}
