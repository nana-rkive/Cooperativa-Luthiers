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
exports.CreateInstrumentoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateInstrumentoDto {
    modeloMadeira;
    dataEntrada;
    reparoConcluido;
    custoReparo;
}
exports.CreateInstrumentoDto = CreateInstrumentoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ana Silva' }),
    __metadata("design:type", String)
], CreateInstrumentoDto.prototype, "modeloMadeira", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ana@email.com' }),
    __metadata("design:type", Date)
], CreateInstrumentoDto.prototype, "dataEntrada", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ana@email.com' }),
    __metadata("design:type", Boolean)
], CreateInstrumentoDto.prototype, "reparoConcluido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'ana@email.com' }),
    __metadata("design:type", Number)
], CreateInstrumentoDto.prototype, "custoReparo", void 0);
//# sourceMappingURL=create-instrumento.dto.js.map