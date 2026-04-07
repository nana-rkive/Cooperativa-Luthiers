"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const instrumento_orm_entity_1 = require("../../modules/instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity");
const luthier_orm_entity_1 = require("../../modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'sqlite',
    database: 'data/app.db',
    entities: [instrumento_orm_entity_1.InstrumentoOrmEntity, luthier_orm_entity_1.LuthierOrmEntity],
    synchronize: true,
});
//# sourceMappingURL=typeorm.datasource.js.map