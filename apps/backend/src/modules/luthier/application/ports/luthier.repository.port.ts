import { Luthier } from '../../domain/luthier';

export interface LuthierComInstrumentos extends Luthier {
    instrumentos: {
        id: number;
        modeloMadeira: string;
        dataEntrada: Date;
        reparoConcluido: boolean;
        custoReparo: number;
    }[];
}

export interface LuthierRepositoryPort {
    create(luthier: Luthier): Promise<Luthier>;
    findById(id: number): Promise<Luthier | null>;
    findByIdWithInstrumentos(id: number): Promise<LuthierComInstrumentos | null>;
    findAll(): Promise<Luthier[]>;
    update(luthier: Luthier): Promise<Luthier>;
    delete(id: number): Promise<void>;
}
