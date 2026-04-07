import { Repository } from 'typeorm';
import { InstrumentoRepositoryPort } from '../../../application/ports/instrumento.repository.port';
import { Instrumento } from '../../../domain/instrumento';
import { InstrumentoOrmEntity } from './instrumento.orm-entity';
export declare class InstrumentoTypeOrmRepository implements InstrumentoRepositoryPort {
    private readonly repo;
    constructor(repo: Repository<InstrumentoOrmEntity>);
    create(instrumento: Instrumento): Promise<Instrumento>;
    findById(id: number): Promise<Instrumento | null>;
    findAll(): Promise<Instrumento[]>;
    findByEmail(email: string): Promise<Instrumento | null>;
    update(instrumento: Instrumento): Promise<Instrumento>;
    delete(id: number): Promise<void>;
    private toDomain;
}
