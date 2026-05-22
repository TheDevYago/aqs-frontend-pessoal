

export interface Matriz {
    id?: number;
    nome: string;
    descricao: string;
    curso: any;
    cursoId?: number | null;
    cursoNome?: string;
    qtdDisciplinas?: number;
    disciplinas?: any[];
    status: boolean;
    dataCadastro?: string;
}
