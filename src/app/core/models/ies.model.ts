export interface Ies {
  id?: number; // O '?' significa que no cadastro o ID ainda não existe
  nome: string;
  endereco: string;
  telefone: string; 
  status: boolean | 'Ativo' | 'Inativo'; // Pode ser um booleano ou uma string para facilitar a exibição
}