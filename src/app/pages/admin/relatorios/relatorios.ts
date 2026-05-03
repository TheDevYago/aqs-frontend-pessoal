import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { RelatorioService } from '../../../core/services/relatorio.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorios.html',
  styleUrl: './relatorios.css',
})
export class Relatorios implements OnInit {
  private toastService = inject(ToastServ);
  private relatorioServ = inject(RelatorioService);

  tiposRelatorios = [
    { id: 'escolas', titulo: 'Lista de Escolas', descricao: 'Relatório com Todas as Escolas Cadastradas' },
    { id: 'professores', titulo: 'Professores (Ativos/Inativos)', descricao: 'Lista Completa de Professores com Status' },
    { id: 'cursos', titulo: 'Curso com Matrizes', descricao: 'Relatório de Cursos e suas Matrizes Curriculares' },
    { id: 'disciplinas', titulo: 'Disciplinas com Matrizes', descricao: 'Lista de Disciplinas por Matriz Curricular' },
    { id: 'alunos', titulo: 'Alunos com Monitoria', descricao: 'Alunos Participantes de Programas de Monitoria' },
    { id: 'monitores', titulo: 'Lista de Monitores', descricao: 'Todos os Monitores Cadastrados no Sistema' },
    { id: 'monitorias', titulo: 'Monitorias (Status Geral)', descricao: 'Monitorias Finalizadas e Em Andamento' },
    { id: 'quantitativo', titulo: 'Quantitativo por Semestre', descricao: 'Estatísticas de Alunos por Período e Disciplina' }
  ];

  relatorioAtivo: any;

  filtroDataInicial: string = '';
  filtroDataFinal: string = '';
  filtroFormato: string = 'PDF';
  filtroSemestre: string = '2026.1';

  gerando: boolean = false;

  ngOnInit() {
    this.relatorioAtivo = this.tiposRelatorios[0]
  }

  selecionarRelatorio(relatorio: any) {
    this.relatorioAtivo = relatorio;
    this.filtroDataInicial = '';
    this.filtroDataFinal = '';
    this.filtroFormato = 'PDF';
  }

  gerarRelatorio(){
    if( this.gerando) return;

    this.gerando = true;
    this.toastService.exibir(`Processando relatório "${this.relatorioAtivo.titulo}"...`, 'sucesso');

    const filtros = {
      inicio: this.filtroDataInicial,
      fim: this.filtroDataFinal,
      semestre: this.relatorioAtivo.id === 'quantitativo' ? this.filtroSemestre : null
    };

    this.relatorioServ.baixarRelatorio(this.relatorioAtivo.id, this.filtroFormato.toLowerCase(), filtros).subscribe({
      next: (arquivoBlob) => {
        const url = window.URL.createObjectURL(arquivoBlob);
        const linkDownload = document.createElement('a');
        linkDownload.href = url;
        linkDownload.download = `Relatorio_${this.relatorioAtivo.id}_${new Date().getTime()}.${this.filtroFormato.toLowerCase()}`;
        linkDownload.click();
        window.URL.revokeObjectURL(url);

        this.gerando = false;
        this.toastService.exibir('Download concluído com sucesso!', 'sucesso');
      },
      error: () => {
        this.gerando = false;
        this.toastService.exibir('Erro ao gerar relatório no servidor.', 'aviso');
      }
    });
  }
}
