import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstrumentoRepositoryPort } from '../../../application/ports/instrumento.repository.port';
import { Instrumento } from '../../../domain/instrumento';
import { InstrumentoOrmEntity } from './instrumento.orm-entity';

@Injectable()
export class InstrumentoTypeOrmRepository implements InstrumentoRepositoryPort {
    constructor(
        @InjectRepository(InstrumentoOrmEntity)
        private readonly repo: Repository<InstrumentoOrmEntity>,
    ) { }

    async create(instrumento: Instrumento): Promise<Instrumento> {
        const orm = this.repo.create({
            modeloMadeira: instrumento.modeloMadeira,
            dataEntrada: instrumento.dataEntrada,
            reparoConcluido: instrumento.reparoConcluido,
            custoReparo: instrumento.custoReparo,
            luthier: { id: instrumento.luthierId },
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findById(id: number): Promise<Instrumento | null> {
        const found = await this.repo.findOne({ where: { id }, relations: ['luthier'] });
        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<Instrumento[]> {
        const items = await this.repo.find({ order: { id: 'DESC' }, relations: ['luthier'] });
        return items.map(this.toDomain);
    }

    async findByModeloMadeira(modeloMadeira: string): Promise<Instrumento | null> {
        const found = await this.repo.findOne({ where: { modeloMadeira }, relations: ['luthier'] });
        return found ? this.toDomain(found) : null;
    }

    async update(instrumento: Instrumento): Promise<Instrumento> {
        const orm = await this.repo.findOne({ where: { id: instrumento.id! }, relations: ['luthier'] });
        if (!orm) throw new NotFoundException('Instrumento não encontrado');

        orm.modeloMadeira = instrumento.modeloMadeira;
        orm.dataEntrada = instrumento.dataEntrada;
        orm.reparoConcluido = instrumento.reparoConcluido;
        orm.custoReparo = instrumento.custoReparo;
        orm.luthier = { id: instrumento.luthierId } as any;

        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete({ id });
    }

    private toDomain = (orm: InstrumentoOrmEntity): Instrumento => {
        return new Instrumento(orm.id, orm.modeloMadeira, orm.dataEntrada, orm.reparoConcluido, orm.custoReparo, orm.luthier?.id || (orm as any).luthierId, (orm as any).createdAt, (orm as any).updatedAt);
    };
}
