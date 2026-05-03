import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { CursoService } from '../../../core/services/curso.service';
import { EscolaService } from '../../../core/services/escola.service';
import { Curso } from '../../../core/models/curso.model';
import { Escola } from '../../../core/models/escola.model';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.html',
  styleUrl: './cursos.css',
})
export class Cursos implements OnInit {
  private toastService = inject(ToastServ);
  private cursoServ = inject(CursoService);
  private escolaServ = inject(EscolaService);

  tBusca: string = '';
  listaCursos: Curso[] = [];
  listaEscola: Escola[] = [];

  modalNovoCursoAberto: boolean = false;
  modalInativarAberto: boolean = false;
  modoEdicao: boolean = false;

  cursoSelecionado: Curso | null = null;
  novoCurso: Curso = this.resetCurso(); 

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.cursoServ.listarTodos().subscribe({
      next: (dados) => this.listaCursos = dados,
      error: () => this.toastService.exibir('Erro ao buscar cursos da API', 'aviso')
    });
    this.escolaServ.listarTodas().subscribe(dados => this.listaEscola = dados);
  }

  get cursosFiltrados(){
    if(!this.tBusca){
      return this.listaCursos;
    }
    const termo = this.tBusca.toLowerCase();
    return this.listaCursos.filter(curso => curso.nome.toLowerCase().includes(termo) || curso.sigla.toLowerCase().includes(termo));
  }

  salvarNovoCurso(){
    if (this.novoCurso.nome.trim() !== '' && this.novoCurso.sigla.trim() !== '') {
      const operacao = this.modoEdicao ? this.cursoServ.atualizar(this.novoCurso) : this.cursoServ.salvar(this.novoCurso);

      operacao.subscribe({
        next: () => {
          this.toastService.exibir(this.modoEdicao ? 'Curso Atualizado' : 'Novo Curso Cadastrado', 'sucesso');
          this.carregarDados();
          this.fecharModalNovoCurso();
        }
      });
    }
  }

  confirmarInativacao() {
    if(this.cursoSelecionado) {
      this.cursoSelecionado.status = 'Inativo';
      this.cursoServ.atualizar(this.cursoSelecionado).subscribe({
        next: () => {
          this.toastService.exibir(`O curso de ${this.cursoSelecionado?.nome} foi inativado.`, 'aviso');
          this.carregarDados();
          this.fecharModalInativarCurso();
        }
      });
    }
  }

  // Corrigido: sem parênteses depois de 'Curso'
  private resetCurso(): Curso {
    return { sigla: '', nome: '', escola: null as any, turno: '' as any, coordenador: '', status: '' as any };
  }
  
  abrirModalNovoCurso() {
    this.modoEdicao = false;
    this.novoCurso = this.resetCurso();
    this.modalNovoCursoAberto = true;
  }

  fecharModalNovoCurso() {
    this.modalNovoCursoAberto = false;
  }

  abrirModalEditar(curso: Curso) {
    this.modoEdicao = true;
    this.novoCurso = { ...curso };
    this.modalNovoCursoAberto = true;
  }

  abrirModalInativarCurso(curso: Curso) {
    this.cursoSelecionado = curso;
    this.modalInativarAberto = true;
  }

  fecharModalInativarCurso() {
    this.modalInativarAberto = false;
    this.cursoSelecionado = null;
  }
}