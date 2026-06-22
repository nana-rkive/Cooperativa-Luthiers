import { SetMetadata } from '@nestjs/common';
import type { UsuarioRole } from '../../modules/usuario/domain/usuario';

export const ROLES_KEY = 'roles';

/**
 * Marca os roles que têm permissão de acessar o endpoint.
 * Uso: @Roles('admin') ou @Roles('admin', 'luthier')
 */
export const Roles = (
  ...roles: UsuarioRole[]
): MethodDecorator & ClassDecorator => SetMetadata(ROLES_KEY, roles);
