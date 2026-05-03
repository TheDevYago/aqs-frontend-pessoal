import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { MatrizService } from '../../../core/services/matriz.service';
import { CursoService } from '../../../core/services/curso.service';
import { Matriz } from '../../../core/models/matriz.model';
import { Curso } from '../../../core/models/curso.model';
import { DisciplinaService } from '../../../core/services/disciplina.service';

@Component({
  selector: 'app-matrizes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matrizes.html',
  styleUrl: './matrizes.css',
})

export class Matrizes implements OnInit {
  private toastService = inject(ToastServ);
  private matrizServ = inject(MatrizService);
  private cursoServ = inject(CursoService);
  private disciplinaServ = inject(DisciplinaService);

  tBusca: string = '';
  listaMatrizes: Matriz[] = [];
  listaCurso: Curso[] = [];

  modalNovaMatrizAberta:boolean = false;
  modalInativarAberto:boolean = false;
  modoEdicao: boolean = false;

  matrizSelecionada: Matriz | null = null;
  novaMatriz: Matriz = this.resetMatriz();
  
  disciplinasDisponiveis: any[] = [];

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.matrizServ.listarTodos().subscribe({
      next: (dados) => this.listaMatrizes = dados,
      error: () => this.toastService.exibir('Erro ao buscar matrizes da API', 'aviso')
    });
    this.cursoServ.listarTodos().subscribe(dados => this.listaCurso = dados);
    this.disciplinaServ.listarTodas().subscribe(dados => {
      this.disciplinasDisponiveis = dados.map(d => ({...d, selecionada: false}));
    });
  }

  get matrizesFiltradas(){
    if(!this.tBusca) {
      return this.listaMatrizes;
    }
    const termo = this.tBusca.toLowerCase();
    return this.listaMatrizes.filter(matriz => matriz.nome.toLowerCase().includes(termo) || (matriz.curso && matriz.curso.descricao.toLowerCase().includes(termo)));
  }

  salvarNovaMatriz() {
    if (this.novaMatriz.nome.trim() !== '') {
      this.novaMatriz.disciplinas = this.disciplinasDisponiveis.filter(d => d.selecionada === true);

      const operacao = this.modoEdicao ? this.matrizServ.atualizar(this.novaMatriz) : this.matrizServ.salvar(this.novaMatriz);

      operacao.subscribe ({
        next: () => {
          this.toastService.exibir(this.modoEdicao ? 'Matriz Atualizada' : 'Nova Matriz Cadastrada');
          this.carregarDados();
          this.fecharModalNovaMatriz();
        }
      });
    }
  }

  confirmarInativacao () {
    if(this.matrizSelecionada) {
      this.matrizSelecionada.status = 'Inativo';
      this.matrizServ.atualizar(this.matrizSelecionada).subscribe({
        next: () => {
          this.toastService.exibir(`A ${this.matrizSelecionada?.nome} foi inativada`, 'aviso');
          this.carregarDados();
          this.fecharModalInativarMatriz();
        }
      });
    }
  }

  private resetMatriz(): Matriz {
    return { nome: '', descricao: '', curso: null as any, disciplinas: [], status: '' as any};
  }

  abrirModalNovaMatriz() {
    this.modalNovaMatrizAberta = true;
    this.modoEdicao = false;
    this.novaMatriz = this.resetMatriz();
  }

  fecharModalNovaMatriz() {
    this.modalNovaMatrizAberta = false;
    this.novaMatriz = this.resetMatriz();
    this.disciplinasDisponiveis.forEach(d => d.selecionada = false);
  }

  abrirModalInativarMatrizes(matriz: Matriz) {
    this.matrizSelecionada = matriz;
    this.modalInativarAberto = true;
  }

  fecharModalInativarMatriz() {
    this.modalInativarAberto = false;
    this.matrizSelecionada = null;
  }

  abrirModalEditarMatriz(matriz: Matriz) {
    this.modoEdicao = true;
    this.novaMatriz = { ...matriz };
    this.modalNovaMatrizAberta = true;
  }
}