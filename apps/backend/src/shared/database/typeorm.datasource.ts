import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { InstrumentoOrmEntity } from '../../modules/instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity';
import { LuthierOrmEntity } from '../../modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity';
import { UsuarioOrmEntity } from '../../modules/usuario/infrastructure/persistence/typeorm/usuario.orm-entity';
import * as path from 'path';


export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: path.resolve(__dirname, 'data/cooperativa_luthieres.db'),
    entities: [InstrumentoOrmEntity, LuthierOrmEntity, UsuarioOrmEntity],
    synchronize: true,
}) 