import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastServ } from '../../../core/services/toast.service';
import { Ies } from '../../../core/models/ies.model';
import { IesService } from '../../../core/services/ies.service';

@Component({
  selector: 'app-ies',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ies.html',
  styleUrl: './ies.css',
})

export class IesC implements OnInit {
  private toastService = inject(ToastServ);
  private iesService = inject(IesService)
  private cdr = inject(ChangeDetectorRef);

  listaIes: Ies[] = [];
  iesSelecionada: Ies | null = null;
  novaIes: Ies = {
    nome: '',
    endereco: '',
    telefone: '',
    status: true
  }
  
  modalInativarAberto: boolean = false;
  modalNovaIesAberto: boolean = false;
  modoEdicao: boolean = false;
  indexEdicao: number = -1;

  
  
  ngOnInit() {
    this.carregarIes();
  }

  carregarIes() {
    this.iesService.listarTodas().subscribe({
      next: (dados) => {
        console.log('Dados recebidos do Java:', dados); // ADICIONE ISSO AQUI
        this.listaIes = dados;
        this.cdr.detectChanges(); // FORÇA A DETECÇÃO DE MUDANÇAS APÓS RECEBER OS DADOS
      },
      error: () => {
        this.toastService.exibir('Erro ao carregar instituições', 'aviso');
      }
    })
  }

  salvarNovaIes(){
    if(this.novaIes.nome.trim() !== '') {
      if (this.modoEdicao) {
        this.iesService.atualizar(this.novaIes).subscribe ({
          next: () => {
            this.toastService.exibir('IES atualizada com sucesso', 'sucesso');
            this.carregarIes();
            this.fecharModalNovaIes();
          }
        });
      } else {
        this.iesService.salvar(this.novaIes).subscribe({
          next: () => {
            this.toastService.exibir('Nova IES cadastrada com sucesso', 'sucesso');
            this.carregarIes();
            this.fecharModalNovaIes();
          }
        });
      }
    }
  }

  confirmarInativacao(){
    if (this.iesSelecionada && this.iesSelecionada.id) {
      this.iesService.inativar(this.iesSelecionada.id).subscribe({
        next: () => {
          this.toastService.exibir(`${this.iesSelecionada?.nome} foi inativada com sucesso.`, 'aviso');
          this.carregarIes();
          this.fecharModalInativarIES();
        },
        error: () => {
          this.toastService.exibir('Erro ao inativar a IES', 'erro');
        }
      });
    }
  }

  abrirModalNovaIes(){
    this.modoEdicao = false;
    this.novaIes = {nome:'', endereco:'', telefone:'', status: true};
    this.modalNovaIesAberto = true;
  }
  fecharModalNovaIes(){
    this.modalNovaIesAberto = false;
    this.novaIes = {nome:'', endereco:'', telefone:'', status: true}; 
  }
  abrirModalEditarIES (ies: Ies, index: number){
    this.modoEdicao = true;
    this.indexEdicao = index;
    this.novaIes = {...ies};
    this.modalNovaIesAberto = true;
  }
  abrirModalInativarIES(ies: Ies) {
    this.iesSelecionada = ies;
    this.modalInativarAberto = true;
  }
  fecharModalInativarIES() {
    this.modalInativarAberto = false;
    this.iesSelecionada = null;
  } 
}
