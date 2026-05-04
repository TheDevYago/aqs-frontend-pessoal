
export interface Disciplina {
    id?: number;
    sigla: string;
    descricao: string; 
    cargaHoraria: number | string;
    escolaId?: number;
    escola?: any;
    escolaNome?: string;
    matrizId?: number;
    matrizNome?: string;
    matriz?: any;
    preRequisitosSelecionados?: string[];
    preRequisitosStr?: string;
    status: boolean;
    dataCadastro?: string;
}