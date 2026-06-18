import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentoOrmEntity } from '../../modules/instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity';
import { LuthierOrmEntity } from '../../modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
import { UsuarioOrmEntity } from '../../modules/usuario/infrastructure/persistence/typeorm/usuario.orm-entity';
import * as path from 'path';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: path.join(__dirname, '..', '..', '..', 'database.sqlite'),
            autoLoadEntities: true,
            synchronize: true,
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
