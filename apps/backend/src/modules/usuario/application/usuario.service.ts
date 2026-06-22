import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import type { UsuarioRepositoryPort } from './ports/usuario.repository.port';
import { Usuario } from '../domain/usuario';
import { hashPassword, comparePassword } from './utils/hash.util';
import { BusinessException } from '../../../shared/exceptions/business.exception';

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  usuario: {
    id: number;
    primeiroNome: string;
    sobrenome: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class UsuarioService {
  constructor(
    @Inject('UsuarioRepositoryPort')
    private readonly usuarioRepo: UsuarioRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  // ─── Autenticação ───────────────────────────────────────────────────────────

  async cadastro(
    primeiroNome: string,
    sobrenome: string,
    email: string,
    senha: string,
  ): Promise<{ mensagem: string }> {
    const existingUser = await this.usuarioRepo.findByEmail(email);
    if (existingUser) {
      throw new BusinessException(
        'AUTH_001',
        'E-mail já cadastrado, faça seu login.',
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await hashPassword(senha);
    const tokenAtivacao = randomUUID();
    const usuario = new Usuario(
      null,
      primeiroNome,
      sobrenome,
      email,
      hashedPassword,
      false,
      'luthier',
      tokenAtivacao,
    );
    await this.usuarioRepo.create(usuario);

    // Em produção: enviar e-mail com o link de ativação contendo o token
    // Por enquanto, retornamos o token na resposta para facilitar testes
    return {
      mensagem:
        'Conta criada com sucesso. Verifique seu e-mail para ativar a conta.',
    };
  }

  async ativarConta(token: string): Promise<{ mensagem: string }> {
    const usuario = await this.usuarioRepo.findByTokenAtivacao(token);
    if (!usuario) {
      throw new BusinessException(
        'AUTH_007',
        'Token de ativação inválido ou expirado.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (usuario.ativo) {
      throw new BusinessException(
        'AUTH_008',
        'Esta conta já foi ativada.',
        HttpStatus.CONFLICT,
      );
    }

    usuario.ativo = true;
    usuario.tokenAtivacao = null;
    await this.usuarioRepo.update(usuario);

    return { mensagem: 'Conta ativada com sucesso. Faça seu login.' };
  }

  async login(email: string, senha: string): Promise<LoginResponse> {
    const usuario = await this.usuarioRepo.findByEmail(email);
    if (!usuario) {
      throw new BusinessException(
        'AUTH_002',
        'E-mail não cadastrado, faça seu cadastro.',
      );
    }

    const isPasswordCorrect = await comparePassword(senha, usuario.senha);
    if (!isPasswordCorrect) {
      throw new BusinessException('AUTH_003', 'Senha incorreta.');
    }

    if (!usuario.ativo) {
      throw new BusinessException(
        'AUTH_009',
        'Conta aguardando ativação. Verifique seu e-mail.',
        HttpStatus.FORBIDDEN,
      );
    }

    const payload: JwtPayload = {
      sub: usuario.id!,
      email: usuario.email,
      role: usuario.role,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      usuario: {
        id: usuario.id!,
        primeiroNome: usuario.primeiroNome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
        role: usuario.role,
      },
    };
  }

  async validarEmail(
    email: string,
  ): Promise<{ existe: boolean; mensagem: string }> {
    const usuario = await this.usuarioRepo.findByEmail(email);
    if (!usuario) {
      throw new BusinessException(
        'AUTH_002',
        'E-mail não cadastrado, faça seu cadastro.',
      );
    }
    return { existe: true, mensagem: 'E-mail cadastrado e válido.' };
  }

  async redefinirSenha(
    email: string,
    novaSenha: string,
    confirmarNovaSenha: string,
  ): Promise<{ mensagem: string }> {
    if (novaSenha !== confirmarNovaSenha) {
      throw new BusinessException('AUTH_004', 'As senhas não coincidem.');
    }

    const usuario = await this.usuarioRepo.findByEmail(email);
    if (!usuario) {
      throw new BusinessException(
        'AUTH_002',
        'E-mail não cadastrado, faça seu cadastro.',
      );
    }

    usuario.senha = await hashPassword(novaSenha);
    await this.usuarioRepo.update(usuario);

    return { mensagem: 'Senha atualizada com sucesso.' };
  }

  // ─── CRUD de Usuários ────────────────────────────────────────────────────────

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepo.findAll();
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) {
      throw new BusinessException(
        'AUTH_005',
        'Usuário não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findByEmail(email);
  }

  async atualizar(
    id: number,
    dados: {
      primeiroNome?: string;
      sobrenome?: string;
      email?: string;
      ativo?: boolean;
    },
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) {
      throw new BusinessException(
        'AUTH_005',
        'Usuário não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (dados.email && dados.email !== usuario.email) {
      const emailEmUso = await this.usuarioRepo.findByEmail(dados.email);
      if (emailEmUso) {
        throw new BusinessException(
          'AUTH_006',
          'E-mail já está em uso por outro usuário.',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (dados.primeiroNome !== undefined)
      usuario.primeiroNome = dados.primeiroNome;
    if (dados.sobrenome !== undefined) usuario.sobrenome = dados.sobrenome;
    if (dados.email !== undefined) usuario.email = dados.email;
    if (dados.ativo !== undefined) usuario.ativo = dados.ativo;

    return this.usuarioRepo.update(usuario);
  }

  async deletar(id: number): Promise<{ mensagem: string }> {
    const usuario = await this.usuarioRepo.findById(id);
    if (!usuario) {
      throw new BusinessException(
        'AUTH_005',
        'Usuário não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.usuarioRepo.delete(id);
    return { mensagem: 'Usuário removido com sucesso.' };
  }
}
