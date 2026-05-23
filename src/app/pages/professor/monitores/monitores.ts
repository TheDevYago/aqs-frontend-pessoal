import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // Adicionado ChangeDetectorRef
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
  private cdr = inject(ChangeDetectorRef); // Injetado para forçar atualização da tela

  idProfessorLogado: number = 10002; // A matrícula fixa do Professor Pedro

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
    // IMPORTANTE: Atualize o seu MonitoriaService no Angular para apontar para essa nova URL '/monitorias/professor/10002'
    this.monitoriaServ.buscarPorProfessor(this.idProfessorLogado).subscribe({
      next: (dados: any[]) => {
        // TRADUTOR: Converte o DTO do Java para a Interface da Tabela
        this.monitores = dados.map(d => ({
          id: d.id,
          matricula: d.alunoMatricula?.toString(),
          nome: d.alunoNome || 'Sem Nome',
          disciplina: d.disciplinaNome || 'Não Atribuída',
          tipo: d.tipoMonitoria,
          local: d.localAtuacao,
          periodo: `${d.dataInicio} até ${d.dataFim}`, // Concatena as datas
          alunos: 0, // Como não rastreamos quantidade de alunos, deixamos em 0
          status: d.status ? 'Ativo' : 'Inativo' // Transforma Boolean em Texto
        }));

        this.filtrarMonitores();
        this.cdr.detectChanges(); // Redesenha a tela
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

    if (monitor.periodo && monitor.periodo.includes(' até ')) {
      const datas = monitor.periodo.split(' até ');
      this.novoMonitor.dataInicio = datas[0];
      this.novoMonitor.dataTermino = datas[1];
    }
    this.modalNovoMonitorAberto = true;
  }

  salvarNovoMonitor() {
    const payload = {
      id: this.modoEdicao ? this.novoMonitor.id : null,
      alunoMatricula: Number(this.novoMonitor.matricula),
      alunoNome: this.novoMonitor.nome,
      disciplinaId: Number(this.novoMonitor.disciplina),
      tipoMonitoria: this.novoMonitor.tipo,
      semestre: this.novoMonitor.semestre,
      localAtuacao: this.novoMonitor.local,
      dataInicio: this.novoMonitor.dataInicio,
      dataFim: this.novoMonitor.dataTermino,
      status: this.novoMonitor.status === true || this.novoMonitor.status === 'Ativo',
      professorOrientadorMatricula: this.idProfessorLogado
    };

    // Usando 'any' temporariamente para contornar a tipagem estrita no envio do DTO
    const operacao = this.modoEdicao ? this.monitoriaServ.atualizar(payload as any) : this.monitoriaServ.salvar(payload as any);

    operacao.subscribe({
      next: () => {
        this.toastService.exibir(this.modoEdicao ? 'Monitoria atualizada com sucesso' : 'Novo Monitor cadastrado com sucesso', 'sucesso');
        this.carregarDados();
        this.fecharModalNovaMonitoria(); // CORREÇÃO: Fechando o modal correto (estava fecharModalExclusaoMonitoria)
      },
      error: (err) => {
        console.error("🔍 Erro da API ao salvar:", err);
        const mensagemServidor = err.error?.mensagem || err.error?.message || 'Erro interno de banco de dados.';
        this.toastService.exibir(mensagemServidor, 'aviso');
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
