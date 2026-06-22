import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from './usuario.service';
import type { UsuarioRepositoryPort } from './ports/usuario.repository.port';
import { Usuario } from '../domain/usuario';
import * as hashUtil from './utils/hash.util';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeUsuario = (overrides: Partial<Usuario> = {}): Usuario =>
    Object.assign(
        new Usuario(1, 'Maria', 'Souza', 'maria@example.com', 'hashed_pw', true, 'luthier', null),
        overrides,
    );

const makeMockRepo = (): jest.Mocked<UsuarioRepositoryPort> => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findByTokenAtivacao: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('UsuarioService', () => {
    let service: UsuarioService;
    let repo: jest.Mocked<UsuarioRepositoryPort>;
    let jwtService: jest.Mocked<JwtService>;

    beforeEach(async () => {
        repo = makeMockRepo();
        jwtService = { sign: jest.fn().mockReturnValue('mock.jwt.token') } as any;

        // stub bcrypt calls so tests run fast
        jest.spyOn(hashUtil, 'hashPassword').mockResolvedValue('hashed_pw');
        jest.spyOn(hashUtil, 'comparePassword').mockResolvedValue(true);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsuarioService,
                { provide: 'UsuarioRepositoryPort', useValue: repo },
                { provide: JwtService, useValue: jwtService },
            ],
        }).compile();

        service = module.get<UsuarioService>(UsuarioService);
    });

    afterEach(() => jest.restoreAllMocks());

    // ─── cadastro ─────────────────────────────────────────────────────────────

    describe('cadastro()', () => {
        it('deve criar um usuário e retornar mensagem de sucesso', async () => {
            repo.findByEmail.mockResolvedValue(null);
            repo.create.mockResolvedValue(makeUsuario({ ativo: false }));

            const result = await service.cadastro('Maria', 'Souza', 'maria@example.com', 'senha123');

            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(result.mensagem).toContain('Conta criada com sucesso');
        });

        it('AUTH_001 – deve lançar exceção quando e-mail já está cadastrado', async () => {
            repo.findByEmail.mockResolvedValue(makeUsuario());

            await expect(service.cadastro('Maria', 'Souza', 'maria@example.com', 'senha123'))
                .rejects.toMatchObject({ code: 'AUTH_001', status: HttpStatus.CONFLICT });
        });
    });

    // ─── ativarConta ──────────────────────────────────────────────────────────

    describe('ativarConta()', () => {
        it('deve ativar a conta com token válido', async () => {
            const inativo = makeUsuario({ ativo: false, tokenAtivacao: 'valid-token' });
            repo.findByTokenAtivacao.mockResolvedValue(inativo);
            repo.update.mockResolvedValue({ ...inativo, ativo: true, tokenAtivacao: null } as any);

            const result = await service.ativarConta('valid-token');

            expect(inativo.ativo).toBe(true);
            expect(inativo.tokenAtivacao).toBeNull();
            expect(repo.update).toHaveBeenCalledTimes(1);
            expect(result.mensagem).toContain('ativada com sucesso');
        });

        it('AUTH_007 – deve lançar exceção quando token for inválido', async () => {
            repo.findByTokenAtivacao.mockResolvedValue(null);
            await expect(service.ativarConta('invalid-token'))
                .rejects.toMatchObject({ code: 'AUTH_007', status: HttpStatus.BAD_REQUEST });
        });

        it('AUTH_008 – deve lançar exceção quando conta já está ativa', async () => {
            repo.findByTokenAtivacao.mockResolvedValue(makeUsuario({ ativo: true }));
            await expect(service.ativarConta('some-token'))
                .rejects.toMatchObject({ code: 'AUTH_008', status: HttpStatus.CONFLICT });
        });
    });

    // ─── login ────────────────────────────────────────────────────────────────

    describe('login()', () => {
        it('deve retornar accessToken e dados do usuário no login bem-sucedido', async () => {
            repo.findByEmail.mockResolvedValue(makeUsuario({ ativo: true }));

            const result = await service.login('maria@example.com', 'senha123');

            expect(jwtService.sign).toHaveBeenCalledTimes(1);
            expect(result.accessToken).toBe('mock.jwt.token');
            expect(result.usuario.email).toBe('maria@example.com');
        });

        it('AUTH_002 – deve lançar exceção quando e-mail não está cadastrado', async () => {
            repo.findByEmail.mockResolvedValue(null);
            await expect(service.login('desconhecido@example.com', 'senha'))
                .rejects.toMatchObject({ code: 'AUTH_002' });
        });

        it('AUTH_003 – deve lançar exceção quando senha for incorreta', async () => {
            repo.findByEmail.mockResolvedValue(makeUsuario({ ativo: true }));
            jest.spyOn(hashUtil, 'comparePassword').mockResolvedValue(false);

            await expect(service.login('maria@example.com', 'senha_errada'))
                .rejects.toMatchObject({ code: 'AUTH_003' });
        });

        it('AUTH_009 – deve lançar exceção quando conta não está ativa', async () => {
            repo.findByEmail.mockResolvedValue(makeUsuario({ ativo: false }));

            await expect(service.login('maria@example.com', 'senha123'))
                .rejects.toMatchObject({ code: 'AUTH_009', status: HttpStatus.FORBIDDEN });
        });
    });

    // ─── validarEmail ─────────────────────────────────────────────────────────

    describe('validarEmail()', () => {
        it('deve retornar confirmação quando e-mail existe', async () => {
            repo.findByEmail.mockResolvedValue(makeUsuario());
            const result = await service.validarEmail('maria@example.com');
            expect(result.existe).toBe(true);
        });

        it('AUTH_002 – deve lançar exceção quando e-mail não encontrado', async () => {
            repo.findByEmail.mockResolvedValue(null);
            await expect(service.validarEmail('x@x.com'))
                .rejects.toMatchObject({ code: 'AUTH_002' });
        });
    });

    // ─── redefinirSenha ───────────────────────────────────────────────────────

    describe('redefinirSenha()', () => {
        it('deve redefinir a senha com sucesso', async () => {
            repo.findByEmail.mockResolvedValue(makeUsuario());
            repo.update.mockResolvedValue(makeUsuario());

            const result = await service.redefinirSenha('maria@example.com', 'nova123', 'nova123');
            expect(repo.update).toHaveBeenCalledTimes(1);
            expect(result.mensagem).toContain('Senha atualizada');
        });

        it('AUTH_004 – deve lançar exceção quando senhas não coincidem', async () => {
            await expect(service.redefinirSenha('maria@example.com', 'nova123', 'diferente'))
                .rejects.toMatchObject({ code: 'AUTH_004' });
        });

        it('AUTH_002 – deve lançar exceção quando e-mail não existe', async () => {
            repo.findByEmail.mockResolvedValue(null);
            await expect(service.redefinirSenha('x@x.com', 'nova123', 'nova123'))
                .rejects.toMatchObject({ code: 'AUTH_002' });
        });
    });

    // ─── findAll ──────────────────────────────────────────────────────────────

    describe('findAll()', () => {
        it('deve retornar a lista de usuários', async () => {
            const list = [makeUsuario()];
            repo.findAll.mockResolvedValue(list);
            const result = await service.findAll();
            expect(result).toBe(list);
        });
    });

    // ─── findById ─────────────────────────────────────────────────────────────

    describe('findById()', () => {
        it('deve retornar o usuário quando encontrado', async () => {
            const usuario = makeUsuario();
            repo.findById.mockResolvedValue(usuario);
            const result = await service.findById(1);
            expect(result).toBe(usuario);
        });

        it('AUTH_005 – deve lançar exceção quando não encontrado', async () => {
            repo.findById.mockResolvedValue(null);
            await expect(service.findById(99))
                .rejects.toMatchObject({ code: 'AUTH_005', status: HttpStatus.NOT_FOUND });
        });
    });

    // ─── atualizar ────────────────────────────────────────────────────────────

    describe('atualizar()', () => {
        it('deve atualizar os dados do usuário', async () => {
            const usuario = makeUsuario();
            const updated = makeUsuario({ primeiroNome: 'Joana' });
            repo.findById.mockResolvedValue(usuario);
            repo.findByEmail.mockResolvedValue(null);
            repo.update.mockResolvedValue(updated);

            const result = await service.atualizar(1, { primeiroNome: 'Joana' });
            expect(repo.update).toHaveBeenCalledTimes(1);
            expect(result).toBe(updated);
        });

        it('AUTH_005 – deve lançar exceção quando usuário não existe', async () => {
            repo.findById.mockResolvedValue(null);
            await expect(service.atualizar(99, { primeiroNome: 'Joana' }))
                .rejects.toMatchObject({ code: 'AUTH_005' });
        });

        it('AUTH_006 – deve lançar exceção quando novo e-mail já está em uso', async () => {
            const usuario = makeUsuario({ email: 'original@email.com' });
            const outrUsuario = makeUsuario({ email: 'novo@email.com' });
            repo.findById.mockResolvedValue(usuario);
            repo.findByEmail.mockResolvedValue(outrUsuario);

            await expect(service.atualizar(1, { email: 'novo@email.com' }))
                .rejects.toMatchObject({ code: 'AUTH_006', status: HttpStatus.CONFLICT });
        });

        it('não deve verificar e-mail duplicado quando o e-mail não muda', async () => {
            const usuario = makeUsuario({ email: 'maria@example.com' });
            repo.findById.mockResolvedValue(usuario);
            repo.update.mockResolvedValue(usuario);

            await service.atualizar(1, { email: 'maria@example.com' });
            expect(repo.findByEmail).not.toHaveBeenCalled();
        });
    });

    // ─── deletar ──────────────────────────────────────────────────────────────

    describe('deletar()', () => {
        it('deve deletar o usuário existente', async () => {
            repo.findById.mockResolvedValue(makeUsuario());
            repo.delete.mockResolvedValue(undefined);

            const result = await service.deletar(1);
            expect(repo.delete).toHaveBeenCalledWith(1);
            expect(result.mensagem).toContain('removido com sucesso');
        });

        it('AUTH_005 – deve lançar exceção quando usuário não existe', async () => {
            repo.findById.mockResolvedValue(null);
            await expect(service.deletar(99))
                .rejects.toMatchObject({ code: 'AUTH_005' });
        });
    });
});
