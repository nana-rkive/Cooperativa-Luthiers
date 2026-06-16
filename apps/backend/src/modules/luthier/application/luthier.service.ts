import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import type { LuthierRepositoryPort, LuthierComInstrumentos } from './ports/luthier.repository.port';
import { Luthier } from '../domain/luthier';
import { BusinessException } from '../../../shared/exceptions/business.exception';

@Injectable()
export class LuthierService {
    constructor(
        @Inject('LuthierRepositoryPort')
        private readonly luthierRepo: LuthierRepositoryPort
    ) { }

    async create(nomeMestre: string, dataAbertura: Date, certificada: boolean, bancadasNum: number): Promise<Luthier> {

        // LUTHIER_001: Todos os campos são obrigatórios
        if (!nomeMestre || !dataAbertura || certificada === undefined || certificada === null || bancadasNum === undefined || bancadasNum === null) {
            throw new BusinessException('LUTHIER_001', 'Todos os campos são obrigatórios: nomeMestre, dataAbertura, certificada, bancadasNum.');
        }

        // LUTHIER_002: Mínimo de 2 bancadas
        if (bancadasNum < 2) {
            throw new BusinessException('LUTHIER_002', 'Uma oficina de luthier deve possuir no mínimo 2 bancadas.');
        }

        // LUTHIER_003: bancadasNum deve ser número inteiro
        if (!Number.isInteger(bancadasNum)) {
            throw new BusinessException('LUTHIER_003', 'A quantidade de bancadas deve ser um número inteiro.');
        }

        // LUTHIER_004: Nome deve conter nome e sobrenome
        if (nomeMestre.trim().split(' ').length < 2) {
            throw new BusinessException('LUTHIER_004', 'Informe o nome e sobrenome completo do mestre luthier.');
        }

        // LUTHIER_005: Data de abertura não pode ser futura
        if (new Date(dataAbertura) > new Date()) {
            throw new BusinessException('LUTHIER_005', 'A data de abertura não pode ser uma data futura.');
        }

        // LUTHIER_006: Data de abertura não pode ser anterior a 1900
        if (new Date(dataAbertura) < new Date('1900-01-01')) {
            throw new BusinessException('LUTHIER_006', 'A data de abertura não pode ser anterior ao ano de 1900.');
        }

        const luthier = new Luthier(null, nomeMestre, dataAbertura, certificada, bancadasNum);
        return this.luthierRepo.create(luthier);
    }

    async findAll(): Promise<Luthier[]> {
        return this.luthierRepo.findAll();
    }

    async findById(id: number): Promise<Luthier | null> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new BusinessException('LUTHIER_007', 'Luthier não encontrado.', HttpStatus.NOT_FOUND);
        return luthier;
    }

    async findWithInstrumentos(id: number): Promise<LuthierComInstrumentos> {
        const luthier = await this.luthierRepo.findByIdWithInstrumentos(id);
        if (!luthier) throw new BusinessException('LUTHIER_007', 'Luthier não encontrado.', HttpStatus.NOT_FOUND);
        return luthier;
    }

    async update(id: number, nomeMestre: string, dataAbertura: Date, certificada: boolean, bancadasNum: number): Promise<Luthier> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new BusinessException('LUTHIER_007', 'Luthier não encontrado.', HttpStatus.NOT_FOUND);

        if (bancadasNum < 2) {
            throw new BusinessException('LUTHIER_002', 'Uma oficina de luthier deve possuir no mínimo 2 bancadas.');
        }
        if (!Number.isInteger(bancadasNum)) {
            throw new BusinessException('LUTHIER_003', 'A quantidade de bancadas deve ser um número inteiro.');
        }
        if (nomeMestre.trim().split(' ').length < 2) {
            throw new BusinessException('LUTHIER_004', 'Informe o nome e sobrenome completo do mestre luthier.');
        }
        if (new Date(dataAbertura) > new Date()) {
            throw new BusinessException('LUTHIER_005', 'A data de abertura não pode ser uma data futura.');
        }

        luthier.nomeMestre = nomeMestre;
        luthier.dataAbertura = dataAbertura;
        luthier.certificada = certificada;
        luthier.bancadasNum = bancadasNum;

        return this.luthierRepo.update(luthier);
    }

    async deactivate(id: number): Promise<Luthier> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new BusinessException('LUTHIER_007', 'Luthier não encontrado.', HttpStatus.NOT_FOUND);

        luthier.certificada = false;
        return this.luthierRepo.update(luthier);
    }

    async delete(id: number): Promise<void> {
        const luthier = await this.luthierRepo.findById(id);
        if (!luthier) throw new BusinessException('LUTHIER_007', 'Luthier não encontrado.', HttpStatus.NOT_FOUND);

        await this.luthierRepo.delete(id);
    }
}
