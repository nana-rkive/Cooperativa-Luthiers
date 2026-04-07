import { Instrumento } from '../../domain/instrumento';
export interface InstrumentoRepositoryPort {
    create(instrumento: Instrumento): Promise<Instrumento>;
    findById(id: number): Promise<Instrumento | null>;
    findAll(): Promise<Instrumento[]>;
    update(instrumento: Instrumento): Promise<Instrumento>;
    delete(id: number): Promise<void>;
}
