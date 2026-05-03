import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { MonitoriaService } from '../../../core/services/monitoria.service';
import { ResultadoService } from '../../../core/services/resultado.service';
import { FechamentoService } from '../../../core/services/fechamento.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-fechamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fechamento.html',
  styleUrl: './fechamento.css',
})
export class Fechamento implements OnInit {
  private ToastServer = inject(ToastServ);
  private monitoriaServ = inject(MonitoriaService);
  private resultadoServ = inject(ResultadoService);
  private fechamentoServ = inject(FechamentoService);


  currentStep: number = 1;
  totalSteps: number = 3;
  confirmacaoCheck: boolean = false;
  carregarValidacoes: boolean = true;
  processandoFechamento: boolean = false;

  pendencias: any[] = [];

  alunosAtendidos: number = 0;
  indiceAprovado: number = 0;

  ngOnInit() {
    this.cadastarDados();
  }

  cadastarDados() {
    this.carregarValidacoes = true;
    forkJoin({
      monitorias: this.monitoriaServ.listarTodas(),
      resultados: this.resultadoServ.listarTodos()
    }).subscribe({
      next: (res) => {
        this.pendencias = [];
        const ativas = res.monitorias.filter(m => m.status === 'Ativo');

        ativas.forEach(m => {
          const temResultado = res.resultados.find(r => r.matricula === m.matricula);
          
          if (!temResultado) {
            this.pendencias.push({
              disciplina: m.disciplina,
              professor: 'Docente Responsável', 
              monitor: m.nome,
              motivo: 'Falta lançamento de resultado final'
            });
          }
        });

        const totalResultados = res.resultados.length;
        if(totalResultados > 0) {
          this.alunosAtendidos = res.resultados.reduce((total, curr) => total + (curr.alunos || 0),0);

          const monitoresAprovados = res.resultados.filter(r => r.parecer === 'Aprovado').length;
          this.indiceAprovado = Math.round((monitoresAprovados/ totalResultados) * 100);
        } else {
          this.alunosAtendidos = 0;
          this.indiceAprovado = 0;
        }
        this.carregarValidacoes = false;
      },
      error: () => {
        this.ToastServer.exibir('Erro ao comunicar com a API para auditoria.', 'aviso');
        this.carregarValidacoes = false;
      }
    });
  }

  proximo() {
    if (this.currentStep < this.totalSteps) this.currentStep++;
  }  

  anterior() {
    if(this.currentStep > 1) this.currentStep--;
  }

  finalizarCiclo() {
    if (!this.confirmacaoCheck) {
      this.ToastServer.exibir('Marque o checkbox de segurança para confirmar o fechamento.', 'aviso');
      return;
    }
    this.processandoFechamento = true;
    this.ToastServer.exibir('Iniciando script de encerramento do semestre...', 'sucesso');

    this.fechamentoServ.encerrarSemestreCorrente().subscribe({
      next: () => {
        this.ToastServer.exibir('Ciclo acadêmico encerrado e arquivado com sucesso!', 'sucesso');
        this.processandoFechamento = false;

        window.location.reload(); // deslogar o sistema
      },
      error: () => {
        this.ToastServer.exibir('Falha crítica ao encerrar o semestre no servidor.', 'aviso');
        this.processandoFechamento = false;
      }
    });
  }
}
