"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const instrumento_controller_1 = require("./presentation/instrumento.controller");
const instrumento_service_1 = require("./application/instrumento.service");
const instrumento_orm_entity_1 = require("./infrastructure/persistence/typeorm/instrumento.orm-entity");
const instrumento_typeorm_repository_1 = require("./infrastructure/persistence/typeorm/instrumento.typeorm.repository");
let InstrumentoModule = class InstrumentoModule {
};
exports.InstrumentoModule = InstrumentoModule;
exports.InstrumentoModule = InstrumentoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([instrumento_orm_entity_1.InstrumentoOrmEntity])],
        controllers: [instrumento_controller_1.InstrumentoController],
        providers: [
            instrumento_service_1.InstrumentoService,
            {
                provide: 'InstrumentoRepositoryPort',
                useClass: instrumento_typeorm_repository_1.InstrumentoTypeOrmRepository,
            },
        ],
    })
], InstrumentoModule);
//# sourceMappingURL=instrumento.module.js.map