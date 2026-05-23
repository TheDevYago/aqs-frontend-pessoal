import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
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
  private cdr = inject(ChangeDetectorRef);

  idProfessorLogado: number = 10002

  professor: any = {nome: '', matricula: '', email: '', telefone: '', escola: {nome: ''}};
  formData = {nomeCompleto: '', matricula: '', email: '', telefone: ''};
  novaFormacao = {categoria: '', instituicao: '', curso: '', ano: ''};

  formacoes: Formacao[] = [];

  abrirModalFormacao: boolean = false;
  modoEdicao: boolean = false;
  fotoPreview: string | ArrayBuffer | null = null;

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.professorServ.buscarPorId(this.idProfessorLogado).subscribe({
      next: (dados: any) => {
        // Mapeia os dados do professor e a escola
        this.professor = { ...dados, escola: { nome: dados.escolaNome } };

        // Traduz do DTO do Java para a Interface do HTML
        this.formacoes = (dados.formacoes || []).map((f: any) => ({
          nivel: f.titulacao,
          instituicao: f.instituicao,
          curso: f.nomeCurso,
          ano: f.anoConclusao?.toString()
        }));

        this.formData = {
          nomeCompleto: dados.nome,
          matricula: dados.matricula,
          email: dados.email,
          telefone: dados.telefone
        };

        this.cdr.detectChanges();
      },
      error: () => this.toastService.exibir('Erro ao carregar dados do perfil', 'aviso')
    });
  }

  ativarEdicao() {
    this.modoEdicao = true;
    // Garante que o formulário recarregue os dados originais caso o usuário tenha apagado algo e desistido
    this.formData = {
      nomeCompleto: this.professor.nome,
      matricula: this.professor.matricula,
      email: this.professor.email,
      telefone: this.professor.telefone
    };
  }

  cancelarEdicao() {
    this.modoEdicao = false;
  }

  // Helper para traduzir da Interface do HTML para o DTO do Java antes de salvar
  private getPayloadComFormacoes() {
    return {
      ...this.professor,
      nome: this.formData.nomeCompleto,
      email: this.formData.email,
      telefone: this.formData.telefone,
      formacoes: this.formacoes.map(f => ({
        titulacao: f.nivel,
        instituicao: f.instituicao,
        nomeCurso: f.curso,
        anoConclusao: Number(f.ano)
      }))
    };
  }

  salvarAlteracoes() {
    this.professorServ.atualizar(Number(this.professor.matricula), this.getPayloadComFormacoes()).subscribe({
      next: () => {
        this.toastService.exibir('Alterações salvas com sucesso!', 'sucesso');
        this.modoEdicao = false; // <-- Fecha os inputs e volta pro modo texto
        this.carregarDados();
      },
      error: () => this.toastService.exibir('Erro ao atualizar perfil', 'aviso')
    });
  }

  abrirModal () { this.abrirModalFormacao = true; }

  fecharModal() {
    this.abrirModalFormacao = false;
    this.novaFormacao = { categoria: '', instituicao: '', curso: '', ano: '' };
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

    // Adiciona na tela e gera o payload traduzido pro backend
    this.formacoes = [nova, ...this.formacoes];

    this.professorServ.atualizar(Number(this.professor.matricula), this.getPayloadComFormacoes()).subscribe({
      next: () => {
        this.toastService.exibir('Formação acadêmica adicionada', 'sucesso');
        this.fecharModal();
        this.carregarDados();
      },
      error: (err) => {
        console.error("🚨 ERRO AO ADICIONAR FORMAÇÃO:", err); // <-- [IMPRIMIR O ERRO]
        this.formacoes.shift(); // Remove a que falhou da tela
        this.toastService.exibir('Erro ao salvar formação', 'aviso');
      }
    });
  }

  removerFormacao(index: number) {
    const formacaoRemovida = this.formacoes[index];
    this.formacoes.splice(index, 1);

    this.professorServ.atualizar(Number(this.professor.matricula), this.getPayloadComFormacoes()).subscribe({
      next: () => {
        this.toastService.exibir('Formação acadêmica removida', 'sucesso');
      },
      error: () => {
        this.toastService.exibir('Erro ao remover formação', 'aviso');
        this.formacoes.splice(index, 0, formacaoRemovida); // Devolve a formação pra tela se der erro
      }
    });
  }

  SelecionarFoto(event: any) {
    const arquivo = event.target.files[0];
    if(arquivo) {
      const reader = new FileReader();
      reader.onload = () => { this.fotoPreview = reader.result; };
      reader.readAsDataURL(arquivo);

      this.professorServ.uploadFoto(this.idProfessorLogado, arquivo).subscribe({
        next: () => {
          this.toastService.exibir('Foto de perfil atualizada!', 'sucesso');
        },
        error: (err) => {
          console.error('Erro no upload:', err);
          this.toastService.exibir('Erro ao salvar foto no servidor', 'aviso');
        }
      });
    }
  }
}
