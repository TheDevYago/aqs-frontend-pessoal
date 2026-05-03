export interface Monitoria {
    id?: number;
    matricula: string;
    nome: string;
    disciplina: string;
    tipo: string;
    local: string;
    periodo: string;
    alunos: number;
    status: boolean | 'Ativo' | 'Inativo'; // Pode ser um booleano ou uma string para facilitar a exibição
    dataCadastro?: string;
}