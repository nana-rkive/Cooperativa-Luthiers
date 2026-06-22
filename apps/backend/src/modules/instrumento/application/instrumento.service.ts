import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import type { LuthierRepositoryPort } from '../../luthier/application/ports/luthier.repository.port';
import type { InstrumentoRepositoryPort } from './ports/instrumento.repository.port';
import { Instrumento } from '../domain/instrumento';
import { BusinessException } from '../../../shared/exceptions/business.exception';

@Injectable()
export class InstrumentoService {
  constructor(
    @Inject('InstrumentoRepositoryPort')
    private readonly instrumentoRepo: InstrumentoRepositoryPort,

    @Inject('LuthierRepositoryPort')
    private readonly luthierRepo: LuthierRepositoryPort,
  ) {}

  async create(
    modeloMadeira: string,
    dataEntrada: Date,
    reparoConcluido: boolean,
    custoReparo: number,
    luthierId: number,
  ): Promise<Instrumento> {
    // INSTRUMENTO_001: Verificar se o Luthier (Oficina) existe
    const luthier = await this.luthierRepo.findById(luthierId);
    if (!luthier) {
      throw new BusinessException(
        'INSTRUMENTO_001',
        `Oficina de Luthier com ID ${luthierId} não encontrada.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // INSTRUMENTO_002: Data de entrada não pode ser anterior à abertura da oficina
    if (new Date(dataEntrada) < new Date(luthier.dataAbertura)) {
      throw new BusinessException(
        'INSTRUMENTO_002',
        'A data de entrada do instrumento não pode ser anterior à abertura da oficina.',
      );
    }

    // INSTRUMENTO_003: Custo do reparo deve estar entre 0 e 50.000
    if (custoReparo < 0 || custoReparo > 50000) {
      throw new BusinessException(
        'INSTRUMENTO_003',
        'O custo do reparo deve ser entre R$ 0,00 e R$ 50.000,00.',
      );
    }

    // INSTRUMENTO_004: Se o reparo está concluído, o custo deve ser maior que zero
    if (reparoConcluido && custoReparo <= 0) {
      throw new BusinessException(
        'INSTRUMENTO_004',
        'Um reparo concluído exige um custo de manutenção maior que zero.',
      );
    }

    // INSTRUMENTO_005: Evitar duplicidade de modelo em reparo para o mesmo luthier
    const todos = await this.instrumentoRepo.findAll();
    const duplicado = todos.find(
      (i) =>
        i.modeloMadeira === modeloMadeira &&
        i.reparoConcluido === false &&
        i.luthierId === luthierId,
    );
    if (duplicado) {
      throw new BusinessException(
        'INSTRUMENTO_005',
        'Este luthier já possui um instrumento deste modelo em reparo no momento.',
        HttpStatus.CONFLICT,
      );
    }

    const instrumento = new Instrumento(
      null,
      modeloMadeira,
      dataEntrada,
      reparoConcluido,
      custoReparo,
      luthierId,
    );
    return this.instrumentoRepo.create(instrumento);
  }

  async update(
    id: number,
    modeloMadeira: string,
    dataEntrada: Date,
    reparoConcluido: boolean,
    custoReparo: number,
    luthierId: number,
  ): Promise<Instrumento> {
    const instrumento = await this.instrumentoRepo.findById(id);
    if (!instrumento)
      throw new BusinessException(
        'INSTRUMENTO_006',
        'Registro de instrumento não encontrado.',
        HttpStatus.NOT_FOUND,
      );

    const luthier = await this.luthierRepo.findById(luthierId);
    if (!luthier) {
      throw new BusinessException(
        'INSTRUMENTO_001',
        `Oficina de Luthier com ID ${luthierId} não encontrada.`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (new Date(dataEntrada) < new Date(luthier.dataAbertura)) {
      throw new BusinessException(
        'INSTRUMENTO_002',
        'A data de entrada do instrumento não pode ser anterior à abertura da oficina.',
      );
    }

    if (custoReparo < 0 || custoReparo > 50000) {
      throw new BusinessException(
        'INSTRUMENTO_003',
        'O custo do reparo deve ser entre R$ 0,00 e R$ 50.000,00.',
      );
    }

    if (reparoConcluido && custoReparo <= 0) {
      throw new BusinessException(
        'INSTRUMENTO_004',
        'Um reparo concluído exige um custo de manutenção maior que zero.',
      );
    }

    const todos = await this.instrumentoRepo.findAll();
    const duplicado = todos.find(
      (i) =>
        i.id !== id &&
        i.modeloMadeira === modeloMadeira &&
        i.reparoConcluido === false &&
        i.luthierId === luthierId,
    );
    if (duplicado) {
      throw new BusinessException(
        'INSTRUMENTO_005',
        'Este luthier já possui um instrumento deste modelo em reparo no momento.',
        HttpStatus.CONFLICT,
      );
    }

    instrumento.modeloMadeira = modeloMadeira;
    instrumento.dataEntrada = dataEntrada;
    instrumento.reparoConcluido = reparoConcluido;
    instrumento.custoReparo = custoReparo;
    instrumento.luthierId = luthierId;

    return this.instrumentoRepo.update(instrumento);
  }

  async findAll(): Promise<Instrumento[]> {
    return this.instrumentoRepo.findAll();
  }

  async findById(id: number): Promise<Instrumento | null> {
    const instrumento = await this.instrumentoRepo.findById(id);
    if (!instrumento)
      throw new BusinessException(
        'INSTRUMENTO_006',
        'Registro de instrumento não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    return instrumento;
  }

  async deactivate(id: number): Promise<Instrumento> {
    const instrumento = await this.instrumentoRepo.findById(id);
    if (!instrumento)
      throw new BusinessException(
        'INSTRUMENTO_006',
        'Instrumento não encontrado.',
        HttpStatus.NOT_FOUND,
      );

    instrumento.reparoConcluido = true;
    return this.instrumentoRepo.update(instrumento);
  }

  async delete(id: number): Promise<void> {
    const exists = await this.instrumentoRepo.findById(id);
    if (!exists)
      throw new BusinessException(
        'INSTRUMENTO_006',
        'Instrumento não encontrado.',
        HttpStatus.NOT_FOUND,
      );
    await this.instrumentoRepo.delete(id);
  }
}
