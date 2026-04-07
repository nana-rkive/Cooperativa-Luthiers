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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LuthierService = void 0;
const common_1 = require("@nestjs/common");
const luthier_1 = require("../domain/luthier");
let LuthierService = class LuthierService {
    luthierRepo;
    constructor(luthierRepo) {
        this.luthierRepo = luthierRepo;
    }
    async create(nomeMestre, dataAbertura, certificada, bancadasNum) {
        const luthier = new luthier_1.Luthier(null, nomeMestre, dataAbertura, certificada, bancadasNum);
        return this.luthierRepo.create(luthier);
    }
    async findAll() {
        return this.luthierRepo.findAll();
    }
    async findById(id) {
        return this.luthierRepo.findById(id);
    }
    async deactivate(id) {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier)
            throw new Error('Luthier não encontrado');
        luthier.certificada = false;
        return this.luthierRepo.update(luthier);
    }
    async delete(id) {
        await this.luthierRepo.delete(id);
    }
};
exports.LuthierService = LuthierService;
exports.LuthierService = LuthierService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('LuthierRepositoryPort')),
    __metadata("design:paramtypes", [Object])
], LuthierService);
//# sourceMappingURL=luthier.service.js.map