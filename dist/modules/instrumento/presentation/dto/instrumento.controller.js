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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstrumentoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const instrumento_service_1 = require("../../application/instrumento.service");
const create_instrumento_dto_1 = require("./dto/create-instrumento.dto");
let InstrumentoController = class InstrumentoController {
    instrumentoService;
    constructor(instrumentoService) {
        this.instrumentoService = instrumentoService;
    }
    create(dto) {
        return this.instrumentoService.create(dto.modeloMadeira, dto.dataEntrada, dto.reparoConcluido, dto.custoReparo);
    }
    findAll() {
        return this.instrumentoService.findAll();
    }
    findById(id) {
        return this.instrumentoService.findById(Number(id));
    }
    deactivate(id) {
        return this.instrumentoService.deactivate(Number(id));
    }
    delete(id) {
        return this.instrumentoService.delete(Number(id));
    }
};
exports.InstrumentoController = InstrumentoController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Cria um usuário' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof create_instrumento_dto_1.CreateInstrumentoDto !== "undefined" && create_instrumento_dto_1.CreateInstrumentoDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], InstrumentoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Lista usuários' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InstrumentoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiParam)({ name: 'id', example: 1 }),
    (0, swagger_1.ApiOperation)({ summary: 'Busca usuário por id' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstrumentoController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Desativa um usuário' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstrumentoController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove um usuário' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InstrumentoController.prototype, "delete", null);
exports.InstrumentoController = InstrumentoController = __decorate([
    (0, swagger_1.ApiTags)('Instrumentos'),
    (0, common_1.Controller)('instrumentos'),
    __metadata("design:paramtypes", [instrumento_service_1.InstrumentoService])
], InstrumentoController);
//# sourceMappingURL=instrumento.controller.js.map