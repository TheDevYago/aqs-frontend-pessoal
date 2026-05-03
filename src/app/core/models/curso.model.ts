import { Escola } from "./escola.model";

export interface Curso {
    id?: number;
    sigla: string;
    nome: string;
    escola: Escola;
    turno: string;
    coordenador: string;
    status: boolean | 'Ativo' | 'Inativo'; // Pode ser um booleano ou uma string para facilitar a exibição
    dataCadastro?: string;
}