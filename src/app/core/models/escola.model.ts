import { Ies } from "./ies.model";

export interface Escola {
    id?: number;
    nome: string;
    coordenadorId?: number; // ID do coordenador           
    coordenador: string;    
    ies: Ies;               
    status: boolean | 'Ativo' | 'Inativo'; // Pode ser um booleano ou uma string para facilitar a exibição
    dataCadastro?: string;
}