import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { MonitoriaService } from '../../../core/services/monitoria.service';
import { Monitoria } from '../../../core/models/monitoria.model';

@Component({
  selector: 'app-monitores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitores.html',
  styleUrl: './monitores.css',
})

export class Monitores implements OnInit{
  private toastService = inject(ToastServ);
  private monitoriaServ = inject(MonitoriaService);

  tBusca: string = '';

  monitores: Monitoria[] = [];
  monitoresFiltrados: Monitoria[] = [];

  modalNovoMonitorAberto: boolean = false;
  modalExcluirAberto:boolean = false;
  modoEdicao: boolean = false;

  monitorSelecionado: Monitoria | null = null;
  novoMonitor: any = this.resetNovoMonitor();


  ngOnInit() {
      this.carregarDados();
  }

  carregarDados() {
    this.monitoriaServ.listarTodas().subscribe({
      next: (dados) => {
        this.monitores = dados;
        this.filtrarMonitores();
      },
      error: () => this.toastService.exibir('Erro ao carregar monitorias', 'aviso')
    });
  }

  filtrarMonitores() {
    if (this.tBusca.trim() === '') {
      this.monitoresFiltrados = [...this.monitores];
    } else {
      const termo = this.tBusca.toLowerCase();
      this.monitoresFiltrados = this.monitores.filter(m => m.nome.toLowerCase().includes(termo) || m.disciplina.toLowerCase().includes(termo) || m.matricula.includes(termo));
    }
  }

  private resetNovoMonitor() {
    return {
      id: null,
      matricula: '',
      nome: '',
      disciplina: '',
      semestre: '',
      tipo: '',
      local: '',
      dataInicio: '',
      dataTermino: '',
      status: 'Ativo'
    };
  }

  abrirModalNovaMonitoria() {
    this.modalNovoMonitorAberto = true;
    this.modoEdicao = false;
    this.novoMonitor = this.resetNovoMonitor();
  }

  fecharModalNovaMonitoria() {
    this.modalNovoMonitorAberto = false;
    this.novoMonitor = this.resetNovoMonitor();
  }

  abrirModalExclusaoMonitoria(monitor: Monitoria) {
    this.monitorSelecionado = monitor;
    this.modalExcluirAberto = true;
  }

  fecharModalExclusaoMonitoria (){
    this.modalExcluirAberto = false;
    this.monitorSelecionado = null;
  }

  abrirModalEditarMonitor(monitor: Monitoria) {
    this.modoEdicao = true;
    this.novoMonitor = {...monitor};
    if (monitor.periodo && monitor.periodo.includes(' - ')) {
      const datas = monitor.periodo.split(' - ');
      this.novoMonitor.dataInicio = datas[0];
      this.novoMonitor.dataTermino = datas[1];
    }
    this.modalNovoMonitorAberto = true;
  }

  salvarNovoMonitor() {

    const dadosParaSalvar = {
      matricula: this.novoMonitor.matricula,
      nome: this.novoMonitor.nome,
      disciplina: this.novoMonitor.disciplina,
      tipo: this.novoMonitor.tipo,
      local: this.novoMonitor.local,
      periodo: `${this.novoMonitor.dataInicio} - ${this.novoMonitor.dataTermino}`,
      alunos: this.modoEdicao && this.novoMonitor.alunos ? this.novoMonitor.alunos: 0,
      status: this.novoMonitor.status
    };

    const operacao = this.modoEdicao ? this.monitoriaServ.atualizar(dadosParaSalvar) : this.monitoriaServ.salvar(dadosParaSalvar);

    operacao.subscribe({
      next: () => {
        this.toastService.exibir(this.modoEdicao ? 'Monitoria atualizada com sucesso' : 'Novo Monitor cadastrado com sucesso', 'sucesso');
        this.carregarDados();
        this.fecharModalExclusaoMonitoria();
      },
      error: () => {
        this.toastService.exibir('Erro ao excluir monitoria', 'aviso');
        this.fecharModalExclusaoMonitoria();
      }
    });
  }

  confirmarExclusao() {
    if(this.monitorSelecionado && this.monitorSelecionado.id) {
      this.monitoriaServ.excluir(this.monitorSelecionado.id).subscribe({
        next: () => {
          this.toastService.exibir('Monitoria excluída com sucesso', 'sucesso');
          this.carregarDados();
          this.fecharModalExclusaoMonitoria();
        },
        error: () => {
          this.toastService.exibir('Erro ao excluir monitoria', 'aviso');
          this.fecharModalExclusaoMonitoria();
        }
      });
    }
  }

}
