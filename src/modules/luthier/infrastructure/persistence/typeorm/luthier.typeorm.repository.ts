import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LuthierRepositoryPort } from '../application/ports/luthier.repository.port';
import { Luthier } from '../domain/luthier';
import { LuthierOrmEntity } from './luthier.orm-entity';

@Injectable()
export class LuthierTypeOrmRepository implements LuthierRepositoryPort {
    constructor(
        @InjectRepository(LuthierOrmEntity)
        private readonly repo: Repository<LuthierOrmEntity>,
    ) { }

    async create(user: Luthier): Promise<Luthier> {
        const orm = this.repo.create({
            nomeMestre: user.nomeMestre,
            dataAbertura: user.dataAbertura,
            certificada: user.certificada,
            bancadasNum: user.bancadasNum,
        });
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async findById(id: number): Promise<Luthier | null> {
        const found = await this.repo.findOneBy({ id });
        return found ? this.toDomain(found) : null;
    }

    async findAll(): Promise<Luthier[]> {
        const items = await this.repo.find({ order: { id: 'DESC' } });
        return items.map(this.toDomain);
    }

    async update(user: Luthier): Promise<Luthier> {
        const orm = await this.repo.findOneBy({ id: user.id! });
        if (!orm) throw new Error('User not found');

        orm.nomeMestre = user.nomeMestre;
        orm.dataAbertura = user.dataAbertura;
        orm.certificada = user.certificada;
        orm.bancadasNum = user.bancadasNum;

        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }

    async delete(id: number): Promise<void> {
        await this.repo.delete({ id });
    }

    private toDomain = (orm: LuthierOrmEntity): Luthier => {
        return new Luthier(orm.id, orm.nomeMestre, orm.dataAbertura, orm.certificada, orm.bancadasNum);
    };
}
