import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LuthierController } from './presentation/luthier.controller';
import { LuthierService } from './application/luthier.service';
import { LuthierOrmEntity } from './infrastructure/persistence/typeorm/luthier.orm-entity';
import { LuthierTypeOrmRepository } from './infrastructure/persistence/typeorm/luthier.typeorm.repository';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([LuthierOrmEntity]),
        UsuarioModule, // fornece PassportModule, JwtModule e JwtStrategy para os guards
    ],
    controllers: [LuthierController],
    providers: [
        LuthierService,
        {
            provide: 'LuthierRepositoryPort',
            useClass: LuthierTypeOrmRepository,
        },
    ],
})
export class LuthierModule { }
