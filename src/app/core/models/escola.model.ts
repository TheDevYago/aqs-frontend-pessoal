import { Ies } from "./ies.model";

export interface Escola {
    id?: number;
    nome: string;
    coordenadorId: number;
    coordenador?: any; // pra o objeto q vem do modal
    nomeCoordenador?: string; // para o nome q vem do java
    ies?: any;
    nomeIes?: string;         
    dataCadastro?: string;
    status: boolean | string;
}