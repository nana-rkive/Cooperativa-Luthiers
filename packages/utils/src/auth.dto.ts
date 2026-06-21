export interface LoginDto {
  email: string;
  senha: string;
}

export interface RegisterDto {
  primeiroNome: string;
  sobrenome: string;
  email: string;
  senha: string;
}

export interface AuthUserDto {
  id: number;
  primeiroNome: string;
  sobrenome: string;
  email: string;
  role: string;
  ativo?: boolean;
}

export interface AuthResponseDto {
  accessToken: string;
  usuario: AuthUserDto;
}
