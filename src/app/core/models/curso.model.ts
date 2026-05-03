import { Escola } from "./escola.model";

export interface Curso {
    id?: number;
    sigla: string;
    descricao: string;
    escolaId?: number; 
    nomeEscola?: string;
    turno: string;
    coordenadorCurso: string;
    status: boolean;
    dataCadastro?: string;
}