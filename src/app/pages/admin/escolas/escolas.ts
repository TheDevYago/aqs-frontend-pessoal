import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { Escola } from '../../../core/models/escola.model';
import { Ies } from '../../../core/models/ies.model';
import { EscolaService } from '../../../core/services/escola.service';
import { IesService } from '../../../core/services/ies.service';
import { ProfessorService } from '../../../core/services/professor.service';

@Component({
  selector: 'app-escolas',
  imports: [CommonModule,FormsModule],
  templateUrl: './escolas.html',
  styleUrl: './escolas.css',
})
export class Escolas implements OnInit {
  toastService = inject(ToastServ);
  escolaService = inject(EscolaService);
  iesService = inject(IesService);
  profService = inject(ProfessorService);
  cdr = inject(ChangeDetectorRef)

  tBusca: string = '';
  listEscolas: Escola[] = [];
  listaIes: Ies[] = [];

  modalNovaEscolaAberto: boolean = false;
  modalInativarAberto: boolean = false;
  modoEdicao: boolean = false;

  escolaSelecionada: Escola | null = null;
  novaEscola: Escola = this.resetEscola();

  listaCoordenadores: any[] = [];

  indexEdicao: number = -1;

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.escolaService.listarTodas().subscribe({
      next: (dados) => {
        this.listEscolas = dados;
        this.cdr.detectChanges();
      },
      error: () => this.toastService.exibir('Erro ao buscar escolas', 'aviso')
    });
    this.iesService.listarTodas().subscribe(dados => this.listaIes = dados);

    this.profService.listarTodos().subscribe({
      next: (dados) => {
        this.listaCoordenadores = dados;
      }
    });
  }

  salvarNovaEscola(){
    if (this.novaEscola.nome.trim() !== '') {

      const escolaDTO = {
        id: this.novaEscola.id,
        nome: this.novaEscola.nome,
        iesId: this.novaEscola.iesId,
        coordenadorId: this.novaEscola.coordenadorId,
        status: this.novaEscola.status === 'Ativo' || this.novaEscola.status === true,
        dataCadastro: this.novaEscola.dataCadastro
      };

      const operacao = this.modoEdicao
        ? this.escolaService.atualizar(escolaDTO.id!, escolaDTO)
        : this.escolaService.salvar(escolaDTO);

      operacao.subscribe({
        next: () => {
          this.toastService.exibir(this.modoEdicao ? 'Escola Atualizada' : 'Escola Cadastrada', 'sucesso');
          this.carregarDados();
          this.fecharModalNovaEscola();
        },
        error: (err) => {
          console.error('Erro ao salvar escola:', err);
          this.toastService.exibir('Erro ao salvar escola.', 'erro');
        }
      });
    }
  }

  confirmarInativacao() {
    if (this.escolaSelecionada && this.escolaSelecionada.id) {
    this.escolaService.inativar(this.escolaSelecionada.id).subscribe({
      next: () => {
        this.toastService.exibir(`A ${this.escolaSelecionada?.nome} foi inativada`, 'aviso');
        this.carregarDados();
        this.fecharModalInativarEscola();
      },
      error: () => this.toastService.exibir('Erro ao inativar escola', 'erro')
    });
  }
  }

  private resetEscola(): Escola {
    return { id: undefined, nome: '', coordenadorId: null as any, coordenador: '', iesId: null as any, ies: null as any, status: '' as any };
  }

  get escolasFiltradas(){
    return this.tBusca ? this.listEscolas.filter(e => e.nome.toLowerCase().includes(this.tBusca.toLowerCase())) : this.listEscolas;
  }

  abrirModalNovaEscola(){
    this.modalNovaEscolaAberto = true;
    this.modoEdicao = false;
    this.novaEscola = this.resetEscola();
  }

  fecharModalNovaEscola(){
    this.modalNovaEscolaAberto = false;
    this.novaEscola = this.resetEscola();
  }

  abrirModalInativarEscola(escola: Escola) {
    this.escolaSelecionada = escola;
    this.modalInativarAberto = true;
  }

  fecharModalInativarEscola() {
    this.modalInativarAberto = false;
    this.escolaSelecionada = null;
  }

  abrirModalEditarEscola(escola: Escola) {
    this.modoEdicao = true;
    this.novaEscola = {...escola};
    this.modalNovaEscolaAberto = true;
  }

  toggleStatus (escola: Escola) {
    if (escola.status) {
      this.abrirModalInativarEscola(escola);
    } else {
      this.escolaService.reativar(escola.id!).subscribe({
        next: () => {
          this.toastService.exibir(`${escola.nome} reativada com sucesso!`, 'sucesso');
          this.carregarDados();
        },
        error: () => this.toastService.exibir('Erro ao reativar escola', 'erro')
      });
    }
  }


}
