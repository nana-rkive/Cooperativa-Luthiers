import { Injectable, Inject, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InstrumentoRepositoryPort } from './ports/instrumento.repository.port';
import { Instrumento } from '../domain/instrumento';

@Injectable()
export class InstrumentoService {
    constructor(
        @Inject('InstrumentoRepositoryPort')
        private readonly instrumentoRepo: InstrumentoRepositoryPort,
        // Necessário injetar a porta do Luthier para validar a data de abertura (Exigência do Tema)
        @Inject('LuthierRepositoryPort')
        private readonly luthierRepo: any
    ) { }

    async create(modeloMadeira: string, dataEntrada: Date, reparoConcluido: boolean, custoReparo: number, luthierId: number): Promise<Instrumento> {

        // 1. Validar se o Luthier (Pai) existe (Exigência de integridade)
        const luthier = await this.luthierRepo.findById(luthierId);
        if (!luthier) {
            throw new NotFoundException('Luthier não encontrado para vincular ao instrumento');
        }

        // 2. Validação de Data: Entrada não pode ser anterior à abertura da oficina
        if (new Date(dataEntrada) < new Date(luthier.dataAbertura)) {
            throw new BadRequestException('A data de entrada não pode ser anterior à data de abertura da oficina');
        }

        // 3. Validação de Custo: Deve estar entre 0 e 50.000
        if (custoReparo <= 0 || custoReparo > 50000) {
            throw new BadRequestException('O custo do reparo deve ser maior que 0 e no máximo 50.000');
        }

        // 4. Validação de Status: Se concluído, o custo não pode ser zero
        if (reparoConcluido && custoReparo <= 0) {
            throw new BadRequestException('Instrumentos com reparo concluído devem ter um custo preenchido');
        }

        // 5. Validação de Duplicidade: Evitar o mesmo modelo em aberto para o mesmo Luthier
        const todos = await this.instrumentoRepo.findAll();
        const duplicado = todos.find(i =>
            i.modeloMadeira === modeloMadeira &&
            i.reparoConcluido === false &&
            i.luthierId === luthierId
        );
        if (duplicado) {
            throw new ConflictException('Já existe um instrumento deste modelo em reparo para este luthier');
        }

        const instrumento = new Instrumento(null, modeloMadeira, dataEntrada, reparoConcluido, custoReparo, luthierId);
        return this.instrumentoRepo.create(instrumento);
    }

    async findAll(): Promise<Instrumento[]> {
        return this.instrumentoRepo.findAll();
    }

    async findById(id: number): Promise<Instrumento | null> {
        const instrumento = await this.instrumentoRepo.findById(id);
        if (!instrumento) throw new NotFoundException('Instrumento não encontrado');
        return instrumento;
    }

    async deactivate(id: number): Promise<Instrumento> {
        const instrumento = await this.instrumentoRepo.findById(id);
        if (!instrumento) throw new NotFoundException('Instrumento não encontrado');

        instrumento.reparoConcluido = true;
        return this.instrumentoRepo.update(instrumento);
    }

    async delete(id: number): Promise<void> {
        await this.instrumentoRepo.delete(id);
    }
}