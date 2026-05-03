import { Escola } from "./escola.model";

export interface Professor {
    escolaNome?: string;
    id?: number;
    matricula: string;
    nome: string;
    email: string;
    telefone: string;
    escola?: any | null;
    status: boolean | 'Ativo' | 'Inativo'; // Pode ser um booleano ou uma string para facilitar a exibição
    dataCadastro?: string;
    formacoes?: Formacao[];
}

export interface Formacao {
    id?: number;
    nivel: string;
    ano: string;
    curso: string;
    instituicao: string;
}