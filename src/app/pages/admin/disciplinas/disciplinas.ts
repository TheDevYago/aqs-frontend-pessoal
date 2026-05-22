import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef)

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
        this.listaDisciplinasExistentes = dados.map(d => ({...d, selecionada: false}));
        this.cdr.detectChanges();
      },
      error: () => this.toastService.exibir('Erro ao carregar disciplinas', 'aviso')
    });
    this.escolaServ.listarTodas().subscribe(dados => {
      this.listaEscola = dados;
      this.cdr.detectChanges();
    });

    this.matrizServ.listarTodos().subscribe(dados => {
      this.listaMatriz = dados;
      this.cdr.detectChanges();
    })
  }

  get disciplinasFiltradas() {
    if(!this.tbusca) {
      return this.listaDisciplinas;
    }
    const termo = this.tbusca.toLowerCase();
    return this.listaDisciplinas.filter(disc => disc.descricao.toLowerCase().includes(termo) || disc.sigla.toLowerCase().includes(termo));
  }

  salvarNovaDisciplina() {
    if (this.novaDisciplina.descricao && this.novaDisciplina.descricao.trim() !== '') {

      const requisitosSelecionados = this.listaDisciplinasExistentes.filter(d => d.selecionada).map(d => d.descricao);

      const stringRequisitos = requisitosSelecionados.length ? requisitosSelecionados.join(', ') : '-'

      const dadosParaEnviar = {
        ...this.novaDisciplina,
        id: this.modoEdicao ? this.novaDisciplina.id : null,
        descricao: this.novaDisciplina.descricao,
        cargaHoraria: Number(this.novaDisciplina.cargaHoraria),
        preRequisitosStr: stringRequisitos,
        escolaId: this.novaDisciplina.escola?.id,
        matrizId: this.novaDisciplina.matriz?.id,
        status: this.novaDisciplina.status
      };

      const operacao = this.modoEdicao ? this.disciplinaServ.atualizar(dadosParaEnviar as any) : this.disciplinaServ.salvar(dadosParaEnviar as any);

      operacao.subscribe({
        next: (disciplinaSalva) => {
          if (this.modoEdicao) {
            const index = this.listaDisciplinas.findIndex(d => d.id === disciplinaSalva.id);
            if (index !== -1) this.listaDisciplinas[index] = { ...disciplinaSalva };
            this.toastService.exibir('Disciplina atualizada!', 'sucesso');
          } else {
            this.listaDisciplinas.unshift(disciplinaSalva);
            this.toastService.exibir('Disciplina cadastrada!', 'sucesso');
          }
          this.fecharModalNovaDisciplina();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro no Java:', err);
          this.toastService.exibir('Erro ao salvar. Verifique o console.', 'erro');
        }
      });
    }
  }

  confirmarInativacao() {
    if(this.disciplinaSelecionada?.id) {

      this.disciplinaSelecionada!.status = false;

      this.disciplinaServ.inativar(this.disciplinaSelecionada.id).subscribe({
        next: () => {
          this.toastService.exibir(`A disciplina ${this.disciplinaSelecionada?.descricao} foi inativada.`, 'aviso');
          this.carregarDados();
          this.fecharModalInativarDisciplina();
          this.cdr.detectChanges();
        }
      });
    }
  }

  private resetDisciplina(): Disciplina {
    return { sigla: '', descricao: '', cargaHoraria: '', escola: null as any, matriz: null as any, preRequisitosSelecionados: [], status: '' as any};
  }

  abrirModalNovaDisciplina() {
    this.modalNovaDisciplinaAberta = true;
    this.modoEdicao = false;
    this.novaDisciplina = this.resetDisciplina();
    if (this.listaDisciplinasExistentes) {
      this.listaDisciplinasExistentes.forEach(d => d.selecionada = false);
    }
  }

  fecharModalNovaDisciplina() {
    this.modalNovaDisciplinaAberta = false;
    this.novaDisciplina = this.resetDisciplina();
    this.cdr.detectChanges();
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
    this.novaDisciplina = {...disciplina};

    if (disciplina.escolaNome || (disciplina as any).escolaId) {
      const idBusca = (disciplina as any).escolaId || disciplina.escola?.id;
      this.novaDisciplina.escola = this.listaEscola.find(e => e.id === idBusca) || null as any;
    }

    if (disciplina.matrizNome || (disciplina as any).matrizId) {
      const idBusca = (disciplina as any).matrizId || disciplina.matriz?.id;
      this.novaDisciplina.matriz = this.listaMatriz.find(m => m.id === idBusca) || null as any;
    }

    const arrayRequisitos = disciplina.preRequisitosStr && disciplina.preRequisitosStr !== '-' ? disciplina.preRequisitosStr.split(', ') : [];

    this.listaDisciplinasExistentes.forEach(d => {
      d.selecionada = arrayRequisitos.includes(d.descricao);
    });

    this.modalNovaDisciplinaAberta = true;
  }

  toggleStatus(disciplina: Disciplina) {
    if (disciplina.status) {
      this.abrirModalInativarDisciplina(disciplina);
    } else {
      this.disciplinaServ.reativar(disciplina.id!).subscribe({
        next: () => {
          disciplina.status = true;
          this.toastService.exibir(`${disciplina.descricao} reativada!`, 'sucesso');
          this.cdr.detectChanges();
        }
      })
    }
  }
}
