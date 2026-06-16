import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InstrumentoOrmEntity } from '../../modules/instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity';
import { LuthierOrmEntity } from '../../modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
import { UsuarioOrmEntity } from '../../modules/usuario/infrastructure/persistence/typeorm/usuario.orm-entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: 'data/cooperativa_luthiers.db',
            entities: [InstrumentoOrmEntity, LuthierOrmEntity, UsuarioOrmEntity],
            synchronize: true,
        }),
    ],
    exports: [TypeOrmModule],
})
export class DatabaseModule { }
