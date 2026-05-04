import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef)

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
      next: (dados) =>  {
        this.listaMatrizes = dados;
        this.cdr.detectChanges();
      },
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

      const dadosParaEnviar = {
        id: this.modoEdicao ? this.novaMatriz.id : null,
        nome: this.novaMatriz.nome,
        descricao: this.novaMatriz.descricao,
        status: this.novaMatriz.status === true,
        cursoId: this.novaMatriz.curso?.id,
      }

      const operacao = this.modoEdicao ? this.matrizServ.atualizar(this.novaMatriz.id!, dadosParaEnviar as any) : this.matrizServ.salvar(dadosParaEnviar as any);

      operacao.subscribe({
        next: (matrizSalva) => {
          if (this.modoEdicao) {
            const index = this.listaMatrizes.findIndex(m => m.id === matrizSalva.id);
            if (index !== -1) this.listaMatrizes[index] = { ...matrizSalva };
            this.toastService.exibir('Matriz Atualizada', 'sucesso');
          } else {
            this.listaMatrizes.unshift(matrizSalva);
            this.toastService.exibir('Nova Matriz Cadastrada', 'sucesso');
          }
          this.fecharModalNovaMatriz();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.toastService.exibir('Erro ao salvar matriz.', 'erro'); 
        }
    });
  }
}

  confirmarInativacao () {
    if (this.matrizSelecionada && this.matrizSelecionada.id) {
      this.matrizServ.inativar(this.matrizSelecionada.id).subscribe({
        next: () => {
          this.matrizSelecionada!.status = false;
          this.toastService.exibir(`A matriz ${this.matrizSelecionada?.nome} foi inativada`, 'aviso');
          this.fecharModalInativarMatriz();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.toastService.exibir('Erro ao inativar matriz.', 'erro');
        }
      })
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

  toggleStatus(matriz: Matriz) {
    if(matriz.status) {
      this.abrirModalInativarMatrizes(matriz);
    } else {
      this.matrizServ.reativar(matriz.id!).subscribe({
        next: () => {
          matriz.status = true
          this.toastService.exibir(`${matriz.nome} foi reativada!`, 'sucesso');
          this.carregarDados();
        }
      });
    }
  }

}