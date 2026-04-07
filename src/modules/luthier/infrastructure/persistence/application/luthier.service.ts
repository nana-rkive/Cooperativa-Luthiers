import { Injectable, Inject } from '@nestjs/common';
import type { LuthierRepositoryPort } from './ports/luthier.repository.port';
import { Luthier } from '../domain/luthier';

@Injectable()
export class LuthierService {
    constructor(
        @Inject('LuthierRepositoryPort')
        private readonly luthierRepo: LuthierRepositoryPort
    ) { }

    async create(nomeMestre: string, dataAbertura: Date, certificada: boolean, bancadasNum: number): Promise<Luthier> {
        const luthier = new Luthier(null, nomeMestre, dataAbertura, certificada, bancadasNum);
        return this.luthierRepo.create(luthier);
    }

    async findAll(): Promise<Luthier[]> {
        return this.luthierRepo.findAll();
    }

    async findById(id: number): Promise<Luthier | null> {
        return this.luthierRepo.findById(id);
    }

    async deactivate(id: number): Promise<Luthier> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new Error('Luthier não encontrado');

        luthier.certificada = false;
        return this.luthierRepo.update(luthier);
    }

    async delete(id: number): Promise<void> {
        await this.luthierRepo.delete(id);
    }
}
