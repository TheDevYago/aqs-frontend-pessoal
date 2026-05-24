export interface Login {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  usuario: { // O JSON envia como "usuario", não "usuarioDTO"
    id: number;
    login: string;
    role: string;
    matriculaProfessor: number; // Agora a interface conhece o campo
  };
}
