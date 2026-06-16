import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import type { UsuarioRepositoryPort } from './ports/usuario.repository.port';
import { Usuario } from '../domain/usuario';
import { hashPassword, comparePassword } from './utils/hash.util';
import { BusinessException } from '../../../shared/exceptions/business.exception';

@Injectable()
export class UsuarioService {
    constructor(
        @Inject('UsuarioRepositoryPort')
        private readonly usuarioRepo: UsuarioRepositoryPort,
    ) { }

    // ─── Autenticação ───────────────────────────────────────────────────────────

    async cadastro(primeiroNome: string, sobrenome: string, email: string, senha: string): Promise<{ mensagem: string }> {
        // AUTH_001: E-mail já cadastrado
        const existingUser = await this.usuarioRepo.findByEmail(email);
        if (existingUser) {
            throw new BusinessException('AUTH_001', 'E-mail já cadastrado, faça seu login.', HttpStatus.CONFLICT);
        }

        const hashedPassword = hashPassword(senha);
        const usuario = new Usuario(null, primeiroNome, sobrenome, email, hashedPassword, false);
        await this.usuarioRepo.create(usuario);

        return { mensagem: 'Conta criada com sucesso. A conta aguarda ativação.' };
    }

    async login(email: string, senha: string): Promise<{ mensagem: string; usuario: { primeiroNome: string; sobrenome: string; email: string } }> {
        // AUTH_002: E-mail não cadastrado
        const usuario = await this.usuarioRepo.findByEmail(email);
        if (!usuario) {
            throw new BusinessException('AUTH_002', 'e-mail não cadastrado, faça seu cadastro');
        }

        // AUTH_003: Senha incorreta
        const isPasswordCorrect = comparePassword(senha, usuario.senha);
        if (!isPasswordCorrect) {
            throw new BusinessException('AUTH_003', 'Senha incorreta');
        }

        return {
            mensagem: 'Login realizado com sucesso',
            usuario: {
                primeiroNome: usuario.primeiroNome,
                sobrenome: usuario.sobrenome,
                email: usuario.email,
            },
        };
    }

    async validarEmail(email: string): Promise<{ existe: boolean; mensagem: string }> {
        const usuario = await this.usuarioRepo.findByEmail(email);
        if (!usuario) {
            throw new BusinessException('AUTH_002', 'e-mail não cadastrado, faça seu cadastro');
        }
        return { existe: true, mensagem: 'E-mail cadastrado e válido.' };
    }

    async redefinirSenha(email: string, novaSenha: string, confirmarNovaSenha: string): Promise<{ mensagem: string }> {
        // AUTH_004: As senhas não coincidem
        if (novaSenha !== confirmarNovaSenha) {
            throw new BusinessException('AUTH_004', 'As senhas não coincidem');
        }

        // AUTH_002: E-mail não cadastrado
        const usuario = await this.usuarioRepo.findByEmail(email);
        if (!usuario) {
            throw new BusinessException('AUTH_002', 'e-mail não cadastrado, faça seu cadastro');
        }

        usuario.senha = hashPassword(novaSenha);
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
            throw new BusinessException('AUTH_005', 'Usuário não encontrado.', HttpStatus.NOT_FOUND);
        }
        return usuario;
    }

    async atualizar(
        id: number,
        dados: { primeiroNome?: string; sobrenome?: string; email?: string; ativo?: boolean },
    ): Promise<Usuario> {
        const usuario = await this.usuarioRepo.findById(id);
        if (!usuario) {
            throw new BusinessException('AUTH_005', 'Usuário não encontrado.', HttpStatus.NOT_FOUND);
        }

        // AUTH_006: Novo e-mail já está em uso por outro usuário
        if (dados.email && dados.email !== usuario.email) {
            const emailEmUso = await this.usuarioRepo.findByEmail(dados.email);
            if (emailEmUso) {
                throw new BusinessException('AUTH_006', 'E-mail já está em uso por outro usuário.', HttpStatus.CONFLICT);
            }
        }

        if (dados.primeiroNome !== undefined) usuario.primeiroNome = dados.primeiroNome;
        if (dados.sobrenome !== undefined) usuario.sobrenome = dados.sobrenome;
        if (dados.email !== undefined) usuario.email = dados.email;
        if (dados.ativo !== undefined) usuario.ativo = dados.ativo;

        return this.usuarioRepo.update(usuario);
    }

    async deletar(id: number): Promise<{ mensagem: string }> {
        const usuario = await this.usuarioRepo.findById(id);
        if (!usuario) {
            throw new BusinessException('AUTH_005', 'Usuário não encontrado.', HttpStatus.NOT_FOUND);
        }
        await this.usuarioRepo.delete(id);
        return { mensagem: 'Usuário removido com sucesso.' };
    }
}
