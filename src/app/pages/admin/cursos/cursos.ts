import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { CursoService } from '../../../core/services/curso.service';
import { EscolaService } from '../../../core/services/escola.service';
import { Curso } from '../../../core/models/curso.model';
import { Escola } from '../../../core/models/escola.model';
import { ProfessorService } from '../../../core/services/professor.service';

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
  private profService = inject(ProfessorService);
  private cdr = inject(ChangeDetectorRef);

  tBusca: string = '';
  listaCursos: Curso[] = [];
  listaEscola: Escola[] = [];
  listaProfessores: any[] = [];

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
      next: (dados) => {
        this.listaCursos = dados;
        this.cdr.detectChanges();
      }
    });
    this.escolaServ.listarTodas().subscribe(dados => this.listaEscola = dados);
    this.profService.listarTodos().subscribe(dados => this.listaProfessores = dados); 
  }

  get cursosFiltrados(){
    if(!this.tBusca){
      return this.listaCursos;
    }
    const termo = this.tBusca.toLowerCase();
    return this.listaCursos.filter(curso => curso.descricao.toLowerCase().includes(termo) || curso.sigla.toLowerCase().includes(termo));
  }

  salvarNovoCurso(){
    if (this.novoCurso.descricao.trim() !== '' && this.novoCurso.sigla.trim() !== '') {
      
      const operacao = this.modoEdicao ? this.cursoServ.atualizar(this.novoCurso) : this.cursoServ.salvar(this.novoCurso);

      operacao.subscribe({
        next: () => {
          this.toastService.exibir(this.modoEdicao ? 'Curso Atualizado' : 'Novo Curso Cadastrado', 'sucesso');
          this.carregarDados();
          this.fecharModalNovoCurso();
        },
        error: (err) => {
          console.error('Erro detalhado:', err);
          this.toastService.exibir('Erro ao salvar curso', 'erro');
        }
      });
    }
  }

  confirmarInativacao() {
    if(this.cursoSelecionado && this.cursoSelecionado.id) {
      this.cursoServ.inativar(this.cursoSelecionado.id).subscribe({
        next: () => {
          this.toastService.exibir(`O curso de ${this.cursoSelecionado?.descricao} foi inativado.`, 'aviso');
          this.carregarDados();
          this.fecharModalInativarCurso();
        }
      });
    }
  }

  // Corrigido: sem parênteses depois de 'Curso'
  private resetCurso(): Curso {
    return { sigla: '', descricao: '', escolaId: undefined, turno: '', coordenadorCurso: '', status: true };  
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

  toggleStatus (curso: any) {
    if(curso.status){
      this.abrirModalInativarCurso(curso);
    } else {
      this.cursoServ.reativar(curso.id).subscribe({
        next: () => {
          this.toastService.exibir('Curso reativado!', 'sucesso');
          this.carregarDados();
        }
      });
    }
  }

}