export interface Login {
    login: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    usuarioDTO: {
        id: number;
        login: string;
        roles: string;
    };
}