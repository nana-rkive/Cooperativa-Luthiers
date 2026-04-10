"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentoOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const luthier_orm_entity_1 = require("../../../../luthier/infrastructure/persistence/typeorm/luthier.orm-entity");
let InstrumentoOrmEntity = class InstrumentoOrmEntity {
    id;
    modeloMadeira;
    dataEntrada;
    reparoConcluido;
    custoReparo;
    luthier;
    luthierId;
};
exports.InstrumentoOrmEntity = InstrumentoOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InstrumentoOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], InstrumentoOrmEntity.prototype, "modeloMadeira", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], InstrumentoOrmEntity.prototype, "dataEntrada", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], InstrumentoOrmEntity.prototype, "reparoConcluido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], InstrumentoOrmEntity.prototype, "custoReparo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => luthier_orm_entity_1.LuthierOrmEntity, (luthier) => luthier.instrumentos, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'luthierId' }),
    __metadata("design:type", luthier_orm_entity_1.LuthierOrmEntity)
], InstrumentoOrmEntity.prototype, "luthier", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], InstrumentoOrmEntity.prototype, "luthierId", void 0);
exports.InstrumentoOrmEntity = InstrumentoOrmEntity = __decorate([
    (0, typeorm_1.Entity)('instrumento_reparo')
], InstrumentoOrmEntity);
//# sourceMappingURL=instrumento.orm-entity.js.map