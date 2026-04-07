"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const luthier_orm_entity_1 = require("./modules/luthier/infrastructure/persistence/typeorm/luthier.orm-entity");
const instrumento_orm_entity_1 = require("./modules/instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity");
const typeorm_module_1 = require("./shared/database/typeorm.module");
const luthier_module_1 = require("./modules/luthier/luthier.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_module_1.DatabaseModule, luthier_module_1.LuthierModule,
            typeorm_1.TypeOrmModule.forRoot({
                type: 'sqlite',
                database: 'cooperatica_luthiers.db',
                entities: [luthier_orm_entity_1.LuthierOrmEntity, instrumento_orm_entity_1.InstrumentoOrmEntity],
                synchronize: true,
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map