import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { Professor } from '../../../core/models/professor.model';
import { Escola } from '../../../core/models/escola.model';
import { ProfessorService } from '../../../core/services/professor.service';
import { EscolaService } from '../../../core/services/escola.service';

@Component({
  selector: 'app-professores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professores.html',
  styleUrl: './professores.css',
})
export class Professores implements OnInit {
  private toastService = inject(ToastServ);
  private professorService = inject(ProfessorService);
  private escolaService = inject(EscolaService);

  tBusca: string = '';
  abaAtiva: 'ativos' | 'inativos' = 'ativos';
  
  listaProfessores: Professor[] = [];
  listEscolas: Escola[] = []; 

  modalNovoProfessorAberto = false;
  modalInativarAberto = false;
  modoEdicao = false;

  professorSelecionado: Professor | null = null;
  novoProfessor: Professor = this.resetProfessor();

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.professorService.listarTodos().subscribe({
      next: (dados) => this.listaProfessores = dados,
      error: () => this.toastService.exibir('Erro ao carregar professores', 'aviso')
    });
    this.escolaService.listarTodas().subscribe(dados => this.listEscolas = dados);
  }

  get qtdAtivos() { 
    return this.listaProfessores.filter(p => p.status === true).length; 
  }
  get qtdInativos() { 
    return this.listaProfessores.filter(p => p.status === false).length; 
  }

  get professoresFiltrados() {
    const statusDesejado = this.abaAtiva === 'ativos';
    let filtrados = this.listaProfessores.filter(p => p.status ===statusDesejado);

    if (this.tBusca) {
      filtrados = filtrados.filter(p => 
        p.nome.toLowerCase().includes(this.tBusca.toLowerCase()) || p.matricula.toString().includes(this.tBusca)
      );
    }
    return filtrados;
  }

  mudarAba(aba: 'ativos' | 'inativos') { this.abaAtiva = aba; }

  salvarNovoProfessor() {
    if (this.novoProfessor.nome.trim() !== '' && String(this.novoProfessor.matricula).trim() !== '') {

      const professorDTO = {
        matricula: Number(this.novoProfessor.matricula),
        nome: this.novoProfessor.nome,
        email: this.novoProfessor.email,
        telefone: this.novoProfessor.telefone,
        escolaId: (this.novoProfessor.escola as any)?.id,
        status: this.novoProfessor.status === true || this.novoProfessor.status === 'Ativo',
      }

      const operacao = this.modoEdicao 
        ? this.professorService.atualizar(professorDTO.matricula, professorDTO)
        : this.professorService.salvar(professorDTO);

      operacao.subscribe({
        next: () => {
          this.toastService.exibir(this.modoEdicao ? 'Professor atualizado com sucesso' : 'Novo Professor Cadastrado', 'sucesso');
          this.carregarDados();
          this.fecharModalNovoProfessor();
        },
        error: (err) => {
          console.error('Erro ao salvar professor:', err);
          this.toastService.exibir('Erro ao salvar professor. Verifique os dados e tente novamente.', 'erro');
        }
      });
    }
  }

  confirmarInativacao() {
    if (this.professorSelecionado) {
      this.professorSelecionado.status = false;
      const matricula = Number(this.professorSelecionado.matricula);
      this.professorService.atualizar(matricula, this.professorSelecionado).subscribe({
        next: () => {
          this.toastService.exibir(`Professor(a) ${this.professorSelecionado?.nome} inativado(a)`, 'aviso');
          this.carregarDados();
          this.fecharModalInativarProfessor();
        }
      });
    }
  }

  private resetProfessor(): Professor {
    return { matricula: '', nome: '', email: '', telefone: '', escola: null, status: true, escolaNome: '' , dataCadastro: '' };
  }

  abrirModalNovoProfessor() {
    this.modoEdicao = false;
    this.novoProfessor = this.resetProfessor();
    this.modalNovoProfessorAberto = true;
  }

  fecharModalNovoProfessor() { this.modalNovoProfessorAberto = false; }

  abrirModalEditarProfessor(professor: Professor) {
    this.modoEdicao = true;
    this.novoProfessor = { ...professor };
    this.modalNovoProfessorAberto = true;
  }

  abrirModalInativarProfessor(professor: Professor) {
    this.professorSelecionado = professor;
    this.modalInativarAberto = true;
  }

  fecharModalInativarProfessor() {
    this.modalInativarAberto = false;
    this.professorSelecionado = null;
  }
}