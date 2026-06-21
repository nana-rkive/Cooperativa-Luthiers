export interface LoginDto {
  email: string;
  senha: string;
}

export interface RegisterDto {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponseDto {
  accessToken: string;
  user: {
    id: string;
    nome: string;
    email: string;
    ativo: boolean;
  };
}
