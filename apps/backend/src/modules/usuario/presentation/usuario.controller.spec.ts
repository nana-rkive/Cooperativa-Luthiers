import { Test, TestingModule } from '@nestjs/testing';
import { AuthController, UsuarioController } from './usuario.controller';
import { UsuarioService } from '../application/usuario.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../infrastructure/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Usuario } from '../domain/usuario';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeUsuario = (): Usuario =>
    new Usuario(1, 'Maria', 'Souza', 'maria@example.com', 'hashed_pw', true, 'luthier', null);

const makeMockService = (): jest.Mocked<UsuarioService> => ({
    cadastro: jest.fn(),
    ativarConta: jest.fn(),
    login: jest.fn(),
    validarEmail: jest.fn(),
    redefinirSenha: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
} as any);

// ─── AuthController ────────────────────────────────────────────────────────────

describe('AuthController', () => {
    let controller: AuthController;
    let service: jest.Mocked<UsuarioService>;

    beforeEach(async () => {
        service = makeMockService();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: UsuarioService, useValue: service }],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    afterEach(() => jest.clearAllMocks());

    describe('register()', () => {
        it('deve chamar service.cadastro com os dados corretos', async () => {
            service.cadastro.mockResolvedValue({ mensagem: 'Conta criada com sucesso.' });
            const dto = { primeiroNome: 'Maria', sobrenome: 'Souza', email: 'maria@example.com', senha: '123456' };
            const result = await controller.register(dto as any);
            expect(service.cadastro).toHaveBeenCalledWith('Maria', 'Souza', 'maria@example.com', '123456');
            expect(result.mensagem).toContain('Conta criada');
        });
    });

    describe('cadastro() [legado]', () => {
        it('deve chamar service.cadastro (alias retrocompat)', async () => {
            service.cadastro.mockResolvedValue({ mensagem: 'ok' });
            const dto = { primeiroNome: 'João', sobrenome: 'Melo', email: 'j@ex.com', senha: 'abc' };
            await controller.cadastro(dto as any);
            expect(service.cadastro).toHaveBeenCalledTimes(1);
        });
    });

    describe('ativarConta()', () => {
        it('deve chamar service.ativarConta com o token', async () => {
            service.ativarConta.mockResolvedValue({ mensagem: 'Conta ativada.' });
            const result = await controller.ativarConta('abc-token');
            expect(service.ativarConta).toHaveBeenCalledWith('abc-token');
            expect(result.mensagem).toBe('Conta ativada.');
        });
    });

    describe('login()', () => {
        it('deve chamar service.login com email e senha', async () => {
            const loginResp = { accessToken: 'tok', usuario: {} as any };
            service.login.mockResolvedValue(loginResp);
            const dto = { email: 'maria@example.com', senha: 'senha123' };
            const result = await controller.login(dto as any);
            expect(service.login).toHaveBeenCalledWith('maria@example.com', 'senha123');
            expect(result).toBe(loginResp);
        });
    });

    describe('validarEmail()', () => {
        it('deve chamar service.validarEmail com o email', async () => {
            service.validarEmail.mockResolvedValue({ existe: true, mensagem: 'ok' });
            const dto = { email: 'maria@example.com' };
            const result = await controller.validarEmail(dto as any);
            expect(service.validarEmail).toHaveBeenCalledWith('maria@example.com');
            expect(result.existe).toBe(true);
        });
    });

    describe('redefinirSenha()', () => {
        it('deve chamar service.redefinirSenha com os parâmetros corretos', async () => {
            service.redefinirSenha.mockResolvedValue({ mensagem: 'Senha atualizada.' });
            const dto = { email: 'maria@example.com', novaSenha: 'new123', confirmarNovaSenha: 'new123' };
            const result = await controller.redefinirSenha(dto as any);
            expect(service.redefinirSenha).toHaveBeenCalledWith('maria@example.com', 'new123', 'new123');
            expect(result.mensagem).toBe('Senha atualizada.');
        });
    });
});

// ─── UsuarioController ─────────────────────────────────────────────────────────

describe('UsuarioController', () => {
    let controller: UsuarioController;
    let service: jest.Mocked<UsuarioService>;

    beforeEach(async () => {
        service = makeMockService();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuarioController],
            providers: [
                { provide: UsuarioService, useValue: service },
                Reflector,
            ],
        })
            .overrideGuard(JwtAuthGuard).useValue({ canActivate: () => true })
            .overrideGuard(RolesGuard).useValue({ canActivate: () => true })
            .compile();

        controller = module.get<UsuarioController>(UsuarioController);
    });

    afterEach(() => jest.clearAllMocks());

    describe('findAll()', () => {
        it('deve retornar a lista de usuários', async () => {
            const list = [makeUsuario()];
            service.findAll.mockResolvedValue(list);
            const result = await controller.findAll();
            expect(result).toBe(list);
        });
    });

    describe('findById()', () => {
        it('deve chamar service.findById com id numérico', async () => {
            const usuario = makeUsuario();
            service.findById.mockResolvedValue(usuario);
            const result = await controller.findById('1');
            expect(service.findById).toHaveBeenCalledWith(1);
            expect(result).toBe(usuario);
        });
    });

    describe('atualizar()', () => {
        it('deve chamar service.atualizar com os dados corretos', async () => {
            const usuario = makeUsuario();
            service.atualizar.mockResolvedValue(usuario);
            const dto = { primeiroNome: 'Joana', sobrenome: 'Lima', email: 'j@j.com', ativo: true };
            const result = await controller.atualizar('1', dto as any);
            expect(service.atualizar).toHaveBeenCalledWith(1, dto);
            expect(result).toBe(usuario);
        });
    });

    describe('deletar()', () => {
        it('deve chamar service.deletar com o id correto', async () => {
            service.deletar.mockResolvedValue({ mensagem: 'Usuário removido com sucesso.' });
            const result = await controller.deletar('1');
            expect(service.deletar).toHaveBeenCalledWith(1);
            expect(result.mensagem).toContain('removido');
        });
    });
});
