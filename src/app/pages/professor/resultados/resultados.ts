import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { ResultadoService } from '../../../core/services/resultado.service';
import { MonitoriaService } from '../../../core/services/monitoria.service';
import { Resultado } from '../../../core/models/resultado.model';

@Component({
  selector: 'app-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resultados.html',
  styleUrl: './resultados.css',
})
export class Resultados implements OnInit {
  private toastService = inject(ToastServ);
  private resultadoServ = inject(ResultadoService);
  private monitorServ = inject(MonitoriaService);
  private cdr = inject(ChangeDetectorRef);

  monitoriaPendentes: any[] = [];
  resultadosLancados: Resultado[] = [];

  idProfessorLogado: number = 10002;

  get resumo () {
    return {
      pendentes: this.monitoriaPendentes.length,
      lancados: this.resultadosLancados.length,
      total: this.monitoriaPendentes.length + this.resultadosLancados.length
    }
  }

  modalLancamentoAberto: boolean = false;
  modalExcluirAberto: boolean = false;
  modoEdicao: boolean = false;

  monitorSelecionado: any = null;
  itemSelecionado: Resultado | null = null;

  dadosLancamentos = {
    alunos: '',
    ocorrencias: '',
    parecer: '',
    observacoes: ''
  }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados(){
    // Primeiro carrega os resultados
    this.resultadoServ.listarTodos().subscribe({
      next: (resultados) => {
        this.resultadosLancados = resultados;

        // Depois carrega as monitorias APENAS do professor logado
        this.monitorServ.buscarPorProfessor(this.idProfessorLogado).subscribe({
          next: (monitorias: any[]) => {

            // 1. Filtra as monitorias (ativas e sem resultado)
            const pendentesCrus = monitorias.filter(m =>
              m.status &&
              !this.resultadosLancados.some(r => r.idMonitoria === m.id)
            );

            // 2. O TRADUTOR: Converte os nomes do Java para os nomes que o HTML espera!
            this.monitoriaPendentes = pendentesCrus.map(m => ({
              id: m.id,
              matricula: m.alunoMatricula,
              monitor: m.alunoNome,
              disciplina: m.disciplinaNome,
              semestre: m.semestre,
              dataTermino: m.dataFim,
              alunos: m.alunos || 0,
              status: 'Pendente' // Troca o 'true' para ficar elegante na tabela
            }));

            this.cdr.detectChanges();
          },
          error: () => this.toastService.exibir('Erro ao carregar pendências', 'aviso')
        });
      },
      error: () => this.toastService.exibir('Erro ao carregar resultados', 'aviso')
    });
  }

  abrirModalLancamento (item: any) {
    this.modoEdicao = false;
    this.monitorSelecionado = item;
    this.dadosLancamentos = { alunos: item.alunos ? item.alunos.toString() : 0, ocorrencias: '', parecer: '', observacoes: '' };
    this.modalLancamentoAberto = true;
  }

  fecharModalLancamento() {
    this.modalLancamentoAberto = false;
    this.monitorSelecionado = null;
    this.dadosLancamentos = {alunos: '', ocorrencias: '', parecer: '', observacoes: ''}
  }

  abrirModalEditarResultado(item: Resultado) {
    this.modoEdicao = true;
    this.itemSelecionado = item;
    this.monitorSelecionado = item;
    this.dadosLancamentos = {
      alunos: item.alunos.toString(),
      ocorrencias: item.ocorrencias || '',
      parecer: item.parecer,
      observacoes: item.observacoes || ''
    };
    this.modalLancamentoAberto = true;
  }

  salvarResultado() {
    if(this.modoEdicao && this.itemSelecionado) {
      const resultadoAtualizado: Resultado = {
        ...this.itemSelecionado,
        alunos: Number(this.dadosLancamentos.alunos),
        parecer: this.dadosLancamentos.parecer,
        ocorrencias: this.dadosLancamentos.ocorrencias,
        observacoes: this.dadosLancamentos.observacoes,
      };
      this.resultadoServ.atualizar(resultadoAtualizado).subscribe({
        next: () => {
          this.toastService.exibir('Resultado atualizado com sucesso', 'sucesso');
          this.carregarDados();
          this.fecharModalLancamento();
        },
        error: () => this.toastService.exibir('Erro ao atualizar resultado', 'aviso')
      });
    } else {
      // MAPEAMENTO CORRIGIDO: Lendo as variáveis traduzidas pelo carregarDados()
      const novoResultado: Resultado = {
        idMonitoria: this.monitorSelecionado.id,
        matricula: this.monitorSelecionado.matricula,
        monitor: this.monitorSelecionado.monitor,
        disciplina: this.monitorSelecionado.disciplina,
        semestre: this.monitorSelecionado.semestre || '2026.1',
        alunos: Number(this.dadosLancamentos.alunos),
        parecer: this.dadosLancamentos.parecer,
        ocorrencias: this.dadosLancamentos.ocorrencias,
        observacoes: this.dadosLancamentos.observacoes,
        dataLancamento: new Date().toLocaleDateString('pt-BR')
      };

      this.resultadoServ.salvar(novoResultado).subscribe({
        next: () => {
          this.toastService.exibir('Resultado lançado com sucesso', 'sucesso');
          this.carregarDados();
          this.fecharModalLancamento();
        },
        error: () => this.toastService.exibir('Erro ao lançar resultado', 'aviso')
      });
    }
  }

  abrirModalExcluirLancamento(item: Resultado) {
    this.itemSelecionado = item;
    this.modalExcluirAberto = true;
  }

  fecharModalExcluirLancamento() {
    this.modalExcluirAberto = false;
    this.itemSelecionado = null;
  }

  confirmarExclusao() {
    if (this.itemSelecionado && this.itemSelecionado.id) {
      this.resultadoServ.excluir(this.itemSelecionado.id).subscribe({
        next: () => {
          this.toastService.exibir('Resultado excluído', 'sucesso');
          this.carregarDados();
          this.fecharModalExcluirLancamento();
        },
        error: () => this.toastService.exibir('Erro ao excluir resultado', 'aviso')
      });
    }
  }
}
