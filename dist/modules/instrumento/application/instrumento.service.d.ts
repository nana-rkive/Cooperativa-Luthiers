import { InstrumentoRepositoryPort } from './ports/instrumento.repository.port';
import { Instrumento } from '../domain/instrumento';
export declare class InstrumentoService {
    private readonly instrumentoRepo;
    constructor(instrumentoRepo: InstrumentoRepositoryPort);
    private readonly instrumentoRepo;
    create(name: string, email: string): Promise<Instrumento>;
    findAll(): Promise<User[]>;
    findById(id: number): Promise<User | null>;
    deactivate(id: number): Promise<User>;
    delete(id: number): Promise<void>;
}
