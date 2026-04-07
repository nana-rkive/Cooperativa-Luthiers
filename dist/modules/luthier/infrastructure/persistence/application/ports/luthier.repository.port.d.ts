import { Luthier } from '../../domain/luthier';
export interface LuthierRepositoryPort {
    create(user: Luthier): Promise<Luthier>;
    findById(id: number): Promise<Luthier | null>;
    findAll(): Promise<Luthier[]>;
    update(user: Luthier): Promise<Luthier>;
    delete(id: number): Promise<void>;
}
