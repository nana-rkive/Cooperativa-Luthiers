import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import type { UsuarioRole } from '../../modules/usuario/domain/usuario';
import type { JwtPayload } from '../../modules/usuario/application/usuario.service';

/**
 * Guard de autorização por role.
 *
 * Deve ser usado APÓS o JwtAuthGuard (que popula req.user).
 * Se o endpoint não tiver @Roles(), qualquer usuário autenticado passa.
 *
 * Exemplo de uso combinado:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles('admin')
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UsuarioRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Sem @Roles() → qualquer usuário autenticado tem acesso
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
        const user = request.user;

        return requiredRoles.includes(user?.role as UsuarioRole);
    }
}
