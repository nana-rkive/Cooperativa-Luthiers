"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuthierModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const luthier_controller_1 = require("./infrastructure/persistence/presentation/luthier.controller");
const luthier_service_1 = require("./infrastructure/persistence/application/luthier.service");
const luthier_orm_entity_1 = require("./infrastructure/persistence/typeorm/luthier.orm-entity");
const luthier_typeorm_repository_1 = require("./infrastructure/persistence/typeorm/luthier.typeorm.repository");
let LuthierModule = class LuthierModule {
};
exports.LuthierModule = LuthierModule;
exports.LuthierModule = LuthierModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([luthier_orm_entity_1.LuthierOrmEntity])],
        controllers: [luthier_controller_1.LuthierController],
        providers: [
            luthier_service_1.LuthierService,
            {
                provide: 'LuthierRepositoryPort',
                useClass: luthier_typeorm_repository_1.LuthierTypeOrmRepository,
            },
        ],
    })
], LuthierModule);
//# sourceMappingURL=luthier.module.js.map