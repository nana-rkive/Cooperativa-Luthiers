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
exports.InstrumentoService = void 0;
const common_1 = require("@nestjs/common");
let InstrumentoService = class InstrumentoService {
    instrumentoRepo;
    constructor(instrumentoRepo) {
        this.instrumentoRepo = instrumentoRepo;
    }
    instrumentoRepo;
    async create(name, email) {
        const existing = await this.instrumentoRepo.findByEmail(email);
        if (existing)
            throw new Error('E-mail já cadastrado');
        const user = new User(null, name.trim(), email.trim().toLowerCase(), true);
        return this.usersRepo.create(user);
    }
    async findAll() {
        return this.usersRepo.findAll();
    }
    async findById(id) {
        return this.usersRepo.findById(id);
    }
    async deactivate(id) {
        const user = await this.usersRepo.findById(id);
        if (!user)
            throw new Error('Usuário não encontrado');
        user.isActive = false;
        return this.usersRepo.update(user);
    }
    async delete(id) {
        await this.usersRepo.delete(id);
    }
};
exports.InstrumentoService = InstrumentoService;
__decorate([
    Inject('InstrumentoRepositoryPort'),
    __metadata("design:type", Object)
], InstrumentoService.prototype, "instrumentoRepo", void 0);
exports.InstrumentoService = InstrumentoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], InstrumentoService);
//# sourceMappingURL=instrumento.service.js.map