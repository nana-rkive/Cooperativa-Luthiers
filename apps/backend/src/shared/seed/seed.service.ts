import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  Inject,
} from '@nestjs/common';
import { hashPassword } from '../../modules/usuario/application/utils/hash.util';
import { Usuario } from '../../modules/usuario/domain/usuario';
import type { UsuarioRepositoryPort } from '../../modules/usuario/application/ports/usuario.repository.port';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @Inject('UsuarioRepositoryPort')
    private readonly usuarioRepo: UsuarioRepositoryPort,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedAdmin();
  }

  private async seedAdmin(): Promise<void> {
    const adminEmail =
      process.env.ADMIN_EMAIL ?? 'admin@cooperativaluthiers.com';

    const existing = await this.usuarioRepo.findByEmail(adminEmail);
    if (existing) {
      this.logger.log(`Admin já existe (${adminEmail}), seed ignorado.`);
      return;
    }

    const senhaPlana = process.env.ADMIN_PASSWORD ?? 'Admin@1234';
    const senhaHash = await hashPassword(senhaPlana);

    const admin = new Usuario(
      null,
      'Admin',
      'Sistema',
      adminEmail,
      senhaHash,
      true, // ativo de imediato — admin não precisa de ativação
      'admin',
      null, // sem token de ativação
    );

    await this.usuarioRepo.create(admin);
    this.logger.log(`✅ Admin padrão criado: ${adminEmail}`);
  }
}
