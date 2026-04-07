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
exports.InstrumentoTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const instrumento_1 = require("../../../domain/instrumento");
const instrumento_orm_entity_1 = require("./instrumento.orm-entity");
let InstrumentoTypeOrmRepository = class InstrumentoTypeOrmRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async create(instrumento) {
        const orm = this.repo.create({
            modeloMadeira: instrumento.modeloMadeira,
            dataEntrada: instrumento.dataEntrada,
            reparoConcluido: instrumento.reparoConcluido,
            custoReparo: instrumento.custoReparo,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }
    async findById(id) {
        const found = await this.repo.findOneBy({ id });
        return found ? this.toDomain(found) : null;
    }
    async findAll() {
        const items = await this.repo.find({ order: { id: 'DESC' } });
        return items.map(this.toDomain);
    }
    async findByEmail(email) {
        const found = await this.repo.findOneBy({ modeloMadeira: email });
        return found ? this.toDomain(found) : null;
    }
    async update(instrumento) {
        const orm = await this.repo.findOneBy({ id: instrumento.id });
        if (!orm)
            throw new Error('User not found');
        orm.modeloMadeira = instrumento.modeloMadeira;
        orm.dataEntrada = instrumento.dataEntrada;
        orm.reparoConcluido = instrumento.reparoConcluido;
        orm.custoReparo = instrumento.custoReparo;
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }
    async delete(id) {
        await this.repo.delete({ id });
    }
    toDomain = (orm) => {
        return new instrumento_1.Instrumento(orm.id, orm.modeloMadeira, orm.dataEntrada, orm.reparoConcluido, orm.custoReparo, orm.createdAt, orm.updatedAt);
    };
};
exports.InstrumentoTypeOrmRepository = InstrumentoTypeOrmRepository;
exports.InstrumentoTypeOrmRepository = InstrumentoTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(instrumento_orm_entity_1.InstrumentoOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InstrumentoTypeOrmRepository);
//# sourceMappingURL=instrumento.typeorm.repository.js.map