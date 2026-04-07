import { Repository } from 'typeorm';
import { LuthierRepositoryPort } from '../application/ports/luthier.repository.port';
import { Luthier } from '../domain/luthier';
import { LuthierOrmEntity } from './luthier.orm-entity';
export declare class LuthierTypeOrmRepository implements LuthierRepositoryPort {
    private readonly repo;
    constructor(repo: Repository<LuthierOrmEntity>);
    create(user: Luthier): Promise<Luthier>;
    findById(id: number): Promise<Luthier | null>;
    findAll(): Promise<Luthier[]>;
    update(user: Luthier): Promise<Luthier>;
    delete(id: number): Promise<void>;
    private toDomain;
}
