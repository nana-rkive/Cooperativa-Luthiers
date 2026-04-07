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
exports.LuthierOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const instrumento_orm_entity_1 = require("../../../../instrumento/infrastructure/persistence/typeorm/instrumento.orm-entity");
let LuthierOrmEntity = class LuthierOrmEntity {
    id;
    nomeMestre;
    dataAbertura;
    certificada;
    bancadasNum;
    instrumentos;
};
exports.LuthierOrmEntity = LuthierOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], LuthierOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LuthierOrmEntity.prototype, "nomeMestre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], LuthierOrmEntity.prototype, "dataAbertura", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], LuthierOrmEntity.prototype, "certificada", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LuthierOrmEntity.prototype, "bancadasNum", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => instrumento_orm_entity_1.InstrumentoOrmEntity, (instrumento) => instrumento.luthier),
    __metadata("design:type", Array)
], LuthierOrmEntity.prototype, "instrumentos", void 0);
exports.LuthierOrmEntity = LuthierOrmEntity = __decorate([
    (0, typeorm_1.Entity)('luthier')
], LuthierOrmEntity);
//# sourceMappingURL=luthier.orm-entity.js.map