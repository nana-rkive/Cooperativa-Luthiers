import { Injectable } from '@nestjs/common';
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
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findById(id: number): Promise<Instrumento | null> {
        const found = await this.repo.findOneBy({ id });
        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<Instrumento[]> {
        const items = await this.repo.find({ order: { id: 'DESC' } });
        return items.map(this.toDomain);
    }

    async findByEmail(email: string): Promise<Instrumento | null> {
        const found = await this.repo.findOneBy({ modeloMadeira: email });
        return found ? this.toDomain(found) : null;
    }

    async update(instrumento: Instrumento): Promise<Instrumento> {
        const orm = await this.repo.findOneBy({ id: instrumento.id! });
        if (!orm) throw new Error('User not found');

        orm.modeloMadeira = instrumento.modeloMadeira;
        orm.dataEntrada = instrumento.dataEntrada;
        orm.reparoConcluido = instrumento.reparoConcluido;
        orm.custoReparo = instrumento.custoReparo;

        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete({ id });
    }

    private toDomain = (orm: InstrumentoOrmEntity): Instrumento => {
        return new Instrumento(orm.id, orm.modeloMadeira, orm.dataEntrada, orm.reparoConcluido, orm.custoReparo, orm.createdAt, orm.updatedAt);
    };
}
