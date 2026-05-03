import { Curso } from "./curso.model";

export interface Matriz {
    id?: number;
    nome: string;
    descricao: string;
    curso: Curso;
    disciplinas?: any[];
    status: boolean | 'Ativo' | 'Inativo'; // Pode ser um booleano ou uma string para facilitar a exibição
    dataCadastro?: string;
}