import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { UsuarioModule } from 'src/modules/usuario/usuario.module';

/**
 * SeedModule registra apenas o SeedService.
 * O 'UsuarioRepositoryPort' é resolvido via UsuarioModule,
 * que já está importado globalmente no AppModule antes do SeedModule.
 * Não re-importamos UsuarioModule aqui para evitar duplicidade de providers.
 */
@Module({
  imports: [UsuarioModule],
  providers: [SeedService],
})
export class SeedModule {}
