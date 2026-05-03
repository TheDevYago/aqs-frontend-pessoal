import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { DisciplinaService } from '../../../core/services/disciplina.service';
import { EscolaService } from '../../../core/services/escola.service';
import { MatrizService } from '../../../core/services/matriz.service';
import { Disciplina } from '../../../core/models/disciplina.model';
import { Escola } from '../../../core/models/escola.model';
import { Matriz } from '../../../core/models/matriz.model';

@Component({
  selector: 'app-disciplinas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disciplinas.html',
  styleUrl: './disciplinas.css',
})
export class Disciplinas implements OnInit {
  private toastService = inject(ToastServ);
  private disciplinaServ = inject(DisciplinaService);
  private escolaServ = inject(EscolaService);
  private matrizServ = inject(MatrizService);

  tbusca: string = '';
  listaDisciplinas: Disciplina[] = [];
  listaEscola: Escola[] = [];
  listaMatriz: Matriz[] = [];
  listaDisciplinasExistentes: any[] = [];

  modalNovaDisciplinaAberta: boolean = false;
  modalInativarAberto: boolean = false;
  modoEdicao: boolean = false;

  disciplinaSelecionada: Disciplina | null = null;
  novaDisciplina: Disciplina = this.resetDisciplina();

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.disciplinaServ.listarTodas().subscribe({
      next: (dados) => {
        this.listaDisciplinas = dados;
        this.listaDisciplinasExistentes = dados;
      },
      error: () => this.toastService.exibir('Erro ao carregar disciplinas', 'aviso')
    });
    this.escolaServ.listarTodas().subscribe(dados => this.listaEscola = dados);
    this.matrizServ.listarTodos().subscribe(dados => this.listaMatriz = dados);
  }

  get disciplinasFiltradas() {
    if(!this.tbusca) {
      return this.listaDisciplinas;
    }
    const termo = this.tbusca.toLowerCase();
    return this.listaDisciplinas.filter(disc => disc.nome.toLowerCase().includes(termo) || disc.sigla.toLowerCase().includes(termo));
  }

  salvarNovaDisciplina() {
    if(this.novaDisciplina.nome.trim() !== '' && this.novaDisciplina.sigla.trim() !== '') {
      this.novaDisciplina.preRequisitosStr = this.novaDisciplina.preRequisitosSelecionados && this.novaDisciplina.preRequisitosSelecionados.length > 0 ? this.novaDisciplina.preRequisitosSelecionados.join(', ') : '-';

      if(this.novaDisciplina.ch && !this.novaDisciplina.ch.includes('h')) {
        this.novaDisciplina.ch += 'h';
      }

      const operacao = this.modoEdicao ? this.disciplinaServ.atualizar(this.novaDisciplina) : this.disciplinaServ.salvar(this.novaDisciplina);
      operacao.subscribe({
        next: () => {
          this.toastService.exibir(this.modoEdicao ? 'Disciplina atualizada!' : 'Nova Disciplina cadastrada!', 'sucesso');
          this.carregarDados();
          this.fecharModalNovaDisciplina();
        }
      });
    }
  }

  confirmarInativacao() {
    if(this.disciplinaSelecionada) {
      this.disciplinaSelecionada.status = 'Inativo';
      this.disciplinaServ.atualizar(this.disciplinaSelecionada).subscribe({
        next: () => {
          this.toastService.exibir(`A disciplina ${this.disciplinaSelecionada?.nome} foi inativada.`, 'aviso');
          this.carregarDados();
          this.fecharModalInativarDisciplina();
        }
      });
    }
  }

  private resetDisciplina(): Disciplina {
    return { sigla: '', nome: '', ch: '', escola: null as any, matriz: null as any, preRequisitosSelecionados: [], status: '' as any};
  }

  abrirModalNovaDisciplina() {
    this.modalNovaDisciplinaAberta = true;
    this.modoEdicao = false;
    this.novaDisciplina =  this.resetDisciplina();
  }

  fecharModalNovaDisciplina() {
    this.novaDisciplina = this.resetDisciplina();
  }

  abrirModalInativarDisciplina(disciplina: Disciplina) {
    this.disciplinaSelecionada = disciplina;
    this.modalInativarAberto = true;
  }

  fecharModalInativarDisciplina() {
    this.modalInativarAberto = false;
    this.disciplinaSelecionada = null;
  }

  abrirModalEditarDisciplinas(disciplina: Disciplina) {
    this.modoEdicao = true;
    this.novaDisciplina = { ...disciplina };
    if(disciplina.preRequisitosStr && disciplina.preRequisitosStr !== '-') {
      this.novaDisciplina.preRequisitosSelecionados = disciplina.preRequisitosStr.split(', ');
    } else {
      this.novaDisciplina.preRequisitosSelecionados = [];
    }
    this.modalNovaDisciplinaAberta = true;
  }

  

  
}
