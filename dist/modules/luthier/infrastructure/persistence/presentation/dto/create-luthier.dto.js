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
exports.LuthierDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LuthierDto {
    id;
    nomeMestre;
    dataAbertura;
    certificada;
    bancadasNum;
}
exports.LuthierDto = LuthierDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LuthierDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "João Silva" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LuthierDto.prototype, "nomeMestre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2022-01-01" }),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], LuthierDto.prototype, "dataAbertura", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LuthierDto.prototype, "certificada", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], LuthierDto.prototype, "bancadasNum", void 0);
//# sourceMappingURL=create-luthier.dto.js.map