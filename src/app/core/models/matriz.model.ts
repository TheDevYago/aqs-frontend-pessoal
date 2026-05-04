

export interface Matriz {
    id?: number;
    nome: string;
    descricao: string;
    curso: any;
    cursoNome?: string;    
    qtdDisciplinas?: number;
    disciplinas?: any[];
    status: boolean; 
    dataCadastro?: string;
}