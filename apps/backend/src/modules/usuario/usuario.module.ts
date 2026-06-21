import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController, UsuarioController } from './presentation/usuario.controller';
import { UsuarioService } from './application/usuario.service';
import { UsuarioOrmEntity } from './infrastructure/persistence/typeorm/usuario.orm-entity';
import { UsuarioTypeOrmRepository } from './infrastructure/persistence/typeorm/usuario.typeorm.repository';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsuarioOrmEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET ?? 'cooperativa-luthiers-secret-dev',
            signOptions: { expiresIn: '8h' },
        }),
    ],
    controllers: [AuthController, UsuarioController],
    providers: [
        UsuarioService,
        JwtStrategy,
        {
            provide: 'UsuarioRepositoryPort',
            useClass: UsuarioTypeOrmRepository,
        },
    ],
    exports: [UsuarioService, 'UsuarioRepositoryPort'],
})
export class UsuarioModule { }
