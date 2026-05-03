import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { ProfessorService } from '../../../core/services/professor.service';
import { Formacao, Professor } from '../../../core/models/professor.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})

export class Perfil implements OnInit {
  private toastService = inject(ToastServ);
  private professorServ = inject(ProfessorService);

  idProfessorLogado: number = 1

  professor: any = {nome: '', matricula: '', email: '', telefone: '', escola: {nome: ''}};
  formData = {nomeCompleto: '', matricula: '', email: '', telefone: ''};
  novaFormacao = {categoria: '', instituicao: '', curso: '', ano: ''};

  formacoes: Formacao[] = [];

  abrirModalFormacao: boolean = false;

  fotoPreview: string | ArrayBuffer | null = null;

  ngOnInit() {
      this.carregarDados();
  }

  carregarDados() {
    this.professorServ.buscarPorId(this.idProfessorLogado).subscribe({
      next: (dados) => {
        this.professor = dados;
        this.formacoes = dados.formacoes || [];
        this.formData = {
          nomeCompleto: dados.nome,
          matricula: dados.matricula,
          email: dados.email,
          telefone: dados.telefone
        };
      },
      error: () => this.toastService.exibir('Erro ao carregar dados do perfil', 'aviso')
    });
  }

  salvarAlteracoes() {
    const dadosAtualizados: Professor = {
      ...this.professor, 
      nome: this.formData.nomeCompleto,
      email: this.formData.email,
      telefone: this.formData.telefone
    };

    this.professorServ.atualizar(Number(this.professor.matricula), dadosAtualizados).subscribe({
      next: () => {
        this.toastService.exibir('Alterações salvas com sucesso!', 'sucesso');
        this.carregarDados();
      },
      error: () => this.toastService.exibir('Erro ao atualizar perfil', 'aviso')
    });
  }

  abrirModal () {
    this.abrirModalFormacao = true;
  }

  fecharModal() {
    this.abrirModalFormacao = false;
    this.novaFormacao = {
      categoria: '',
      instituicao: '',
      curso: '',
      ano: ''
    }
  }

  adicionarFormacao() {
    if(!this.novaFormacao.categoria || !this.novaFormacao.instituicao || !this.novaFormacao.curso || !this.novaFormacao.ano) {
      this.toastService.exibir('Preencha todos os campos da formação', 'aviso');      
      return;
    }

    const nova: Formacao = {
      nivel: this.novaFormacao.categoria,
      ano: this.novaFormacao.ano,
      curso: this.novaFormacao.curso,
      instituicao: this.novaFormacao.instituicao
    };

    const listaAtualizada = [nova, ...this.formacoes];
    const professorComFormacao: Professor = {
      ...this.professor,
      formacoes: listaAtualizada
    };

    this.professorServ. atualizar(Number(this.professor.matricula), professorComFormacao).subscribe({
      next: () => {
        this.toastService.exibir('Formação acadêmica adicionada', 'sucesso');
        this.fecharModal();
        this.carregarDados();
      },
      error: () => this.toastService.exibir('Erro ao salvar formação', 'aviso')
    });
  }

  removerFormacao(index: number) {
    this.formacoes.splice(index, 1);

    const professorComFormacaoRemovida: Professor = {
      ...this.professor,
      formacoes: this.formacoes
    };

    this.professorServ.atualizar(Number(this.professor.matricula), professorComFormacaoRemovida).subscribe({
      next: () => {
        this.toastService.exibir('Formação acadêmica removida', 'sucesso');
        this.carregarDados();
      },
      error: () => {
        this.toastService.exibir('Erro ao remover formação', 'aviso');
        this.carregarDados(); // Recarrega do banco em caso de erro para não desincronizar
      }
    });
  }

  SelecionarFoto(event: any) {
    const arquivo = event.target.files[0];
    if(arquivo) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPreview = reader.result;
      };
      reader.readAsDataURL(arquivo);
      this.professorServ.uploadFoto(this.idProfessorLogado, arquivo).subscribe({
        next: () => {
          this.toastService.exibir('Foto de perfil atualizada!', 'sucesso');
          this.carregarDados();
        },
        error: (err) => {
          console.error('Erro no upload:', err);
          this.toastService.exibir('Erro ao salvar foto no servidor', 'aviso');
        }
      });
    }
  }
}

