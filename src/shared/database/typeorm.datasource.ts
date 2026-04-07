import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { InstrumentoOrmEntity } from '../../modules/instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity';
import { LuthierOrmEntity } from '../../modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity';

export const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'data/app.db',
    entities: [InstrumentoOrmEntity, LuthierOrmEntity],
    synchronize: true,
});