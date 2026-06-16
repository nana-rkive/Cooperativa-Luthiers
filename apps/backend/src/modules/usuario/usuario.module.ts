import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController, UsuarioController } from './presentation/usuario.controller';
import { UsuarioService } from './application/usuario.service';
import { UsuarioOrmEntity } from './infrastructure/persistence/typeorm/usuario.orm-entity';
import { UsuarioTypeOrmRepository } from './infrastructure/persistence/typeorm/usuario.typeorm.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UsuarioOrmEntity])],
    controllers: [AuthController, UsuarioController],
    providers: [
        UsuarioService,
        {
            provide: 'UsuarioRepositoryPort',
            useClass: UsuarioTypeOrmRepository,
        },
    ],
    exports: [UsuarioService],
})
export class UsuarioModule { }
