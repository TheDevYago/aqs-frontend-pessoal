import { Matriz } from "./matriz.model";
import { Escola } from "./escola.model";

export interface Disciplina {
    id?: number;
    sigla: string;
    nome: string;
    ch: string;
    escola: Escola;
    matriz: Matriz;
    preRequisitosSelecionados?: string[];
    preRequisitosStr?: string;
    status: boolean | 'Ativo' | 'Inativo'; // Pode ser um booleano ou uma string para facilitar a exibição
    dataCadastro?: string;
}