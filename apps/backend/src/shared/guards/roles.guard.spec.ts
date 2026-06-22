import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from './roles.decorator';
import type { JwtPayload } from '../../modules/usuario/application/usuario.service';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeContext = (user: Partial<JwtPayload> | null = null): ExecutionContext => {
    const request = { user };
    return {
        getHandler: jest.fn().mockReturnValue({}),
        getClass: jest.fn().mockReturnValue({}),
        switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue(request),
        }),
    } as unknown as ExecutionContext;
};

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: jest.Mocked<Reflector>;

    beforeEach(() => {
        reflector = {
            getAllAndOverride: jest.fn(),
        } as unknown as jest.Mocked<Reflector>;

        guard = new RolesGuard(reflector);
    });

    afterEach(() => jest.clearAllMocks());

    it('deve permitir acesso quando não há @Roles() definido no endpoint', () => {
        reflector.getAllAndOverride.mockReturnValue(undefined);
        const ctx = makeContext({ sub: 1, email: 'a@a.com', role: 'luthier' });
        expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve permitir acesso quando roles estiver vazio ([])', () => {
        reflector.getAllAndOverride.mockReturnValue([]);
        const ctx = makeContext({ sub: 1, email: 'a@a.com', role: 'luthier' });
        expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve permitir acesso quando o usuário possui o role requerido (admin)', () => {
        reflector.getAllAndOverride.mockReturnValue(['admin']);
        const ctx = makeContext({ sub: 1, email: 'a@a.com', role: 'admin' });
        expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve permitir acesso quando o usuário possui um dos roles requeridos', () => {
        reflector.getAllAndOverride.mockReturnValue(['admin', 'luthier']);
        const ctx = makeContext({ sub: 1, email: 'a@a.com', role: 'luthier' });
        expect(guard.canActivate(ctx)).toBe(true);
    });

    it('deve negar acesso quando o usuário não possui o role requerido', () => {
        reflector.getAllAndOverride.mockReturnValue(['admin']);
        const ctx = makeContext({ sub: 1, email: 'a@a.com', role: 'luthier' });
        expect(guard.canActivate(ctx)).toBe(false);
    });

    it('deve negar acesso quando o usuário é null/undefined no request', () => {
        reflector.getAllAndOverride.mockReturnValue(['admin']);
        const ctx = makeContext(null);
        expect(guard.canActivate(ctx)).toBe(false);
    });

    it('deve chamar reflector com ROLES_KEY na ordem correta', () => {
        reflector.getAllAndOverride.mockReturnValue(undefined);
        const ctx = makeContext({ sub: 1, email: 'a@a.com', role: 'luthier' });

        guard.canActivate(ctx);

        expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
            ROLES_KEY,
            [ctx.getHandler(), ctx.getClass()],
        );
    });
});
