import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { InstrumentoService } from './instrumento.service';
import type { InstrumentoRepositoryPort } from './ports/instrumento.repository.port';
import type { LuthierRepositoryPort } from '../../luthier/application/ports/luthier.repository.port';
import { Instrumento } from '../domain/instrumento';
import { Luthier } from '../../luthier/domain/luthier';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeLuthier = (overrides: Partial<Luthier> = {}): Luthier =>
  Object.assign(
    new Luthier(1, 'João Silva', new Date('2010-01-01'), true, 3),
    overrides,
  );

const makeInstrumento = (overrides: Partial<Instrumento> = {}): Instrumento =>
  Object.assign(
    new Instrumento(1, 'Violão', new Date('2023-01-01'), false, 100, 1),
    overrides,
  );

const makeMockInstrumentoRepo = (): jest.Mocked<InstrumentoRepositoryPort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const makeMockLuthierRepo = (): jest.Mocked<LuthierRepositoryPort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdWithInstrumentos: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('InstrumentoService', () => {
  let service: InstrumentoService;
  let instrumentoRepo: jest.Mocked<InstrumentoRepositoryPort>;
  let luthierRepo: jest.Mocked<LuthierRepositoryPort>;

  beforeEach(async () => {
    instrumentoRepo = makeMockInstrumentoRepo();
    luthierRepo = makeMockLuthierRepo();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstrumentoService,
        { provide: 'InstrumentoRepositoryPort', useValue: instrumentoRepo },
        { provide: 'LuthierRepositoryPort', useValue: luthierRepo },
      ],
    }).compile();

    service = module.get<InstrumentoService>(InstrumentoService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create()', () => {
    const luthierAbertura = new Date('2010-01-01');
    const defaultParams = () => ({
      modeloMadeira: 'Violão',
      dataEntrada: new Date('2023-06-01'),
      reparoConcluido: false,
      custoReparo: 100,
      luthierId: 1,
    });

    beforeEach(() => {
      luthierRepo.findById.mockResolvedValue(
        makeLuthier({ dataAbertura: luthierAbertura }),
      );
      instrumentoRepo.findAll.mockResolvedValue([]);
      instrumentoRepo.create.mockResolvedValue(makeInstrumento());
    });

    it('deve criar instrumento com dados válidos', async () => {
      const p = defaultParams();
      const result = await service.create(
        p.modeloMadeira,
        p.dataEntrada,
        p.reparoConcluido,
        p.custoReparo,
        p.luthierId,
      );
      expect(instrumentoRepo.create).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({ modeloMadeira: 'Violão' });
    });

    it('INSTRUMENTO_001 – deve lançar exceção quando luthier não existe', async () => {
      luthierRepo.findById.mockResolvedValue(null);
      const p = defaultParams();
      await expect(
        service.create(
          p.modeloMadeira,
          p.dataEntrada,
          p.reparoConcluido,
          p.custoReparo,
          p.luthierId,
        ),
      ).rejects.toMatchObject({
        code: 'INSTRUMENTO_001',
        status: HttpStatus.NOT_FOUND,
      });
    });

    it('INSTRUMENTO_002 – deve lançar exceção quando dataEntrada for anterior à abertura da oficina', async () => {
      const p = defaultParams();
      const anteriorAbertura = new Date('2005-01-01'); // anterior a 2010-01-01
      await expect(
        service.create(
          p.modeloMadeira,
          anteriorAbertura,
          p.reparoConcluido,
          p.custoReparo,
          p.luthierId,
        ),
      ).rejects.toMatchObject({ code: 'INSTRUMENTO_002' });
    });

    it('INSTRUMENTO_003 – deve lançar exceção quando custo for negativo', async () => {
      const p = defaultParams();
      await expect(
        service.create(
          p.modeloMadeira,
          p.dataEntrada,
          p.reparoConcluido,
          -1,
          p.luthierId,
        ),
      ).rejects.toMatchObject({ code: 'INSTRUMENTO_003' });
    });

    it('INSTRUMENTO_003 – deve lançar exceção quando custo for maior que 50000', async () => {
      const p = defaultParams();
      await expect(
        service.create(
          p.modeloMadeira,
          p.dataEntrada,
          p.reparoConcluido,
          50001,
          p.luthierId,
        ),
      ).rejects.toMatchObject({ code: 'INSTRUMENTO_003' });
    });

    it('INSTRUMENTO_004 – deve lançar exceção quando reparo concluído mas custo é 0', async () => {
      const p = defaultParams();
      await expect(
        service.create(p.modeloMadeira, p.dataEntrada, true, 0, p.luthierId),
      ).rejects.toMatchObject({ code: 'INSTRUMENTO_004' });
    });

    it('INSTRUMENTO_005 – deve lançar exceção quando há duplicidade de modelo em reparo para o mesmo luthier', async () => {
      const duplicado = makeInstrumento({
        modeloMadeira: 'Violão',
        reparoConcluido: false,
        luthierId: 1,
      });
      instrumentoRepo.findAll.mockResolvedValue([duplicado]);

      const p = defaultParams();
      await expect(
        service.create(
          p.modeloMadeira,
          p.dataEntrada,
          p.reparoConcluido,
          p.custoReparo,
          p.luthierId,
        ),
      ).rejects.toMatchObject({
        code: 'INSTRUMENTO_005',
        status: HttpStatus.CONFLICT,
      });
    });

    it('deve permitir criar mesmo modelo se o anterior já está concluído (reparoConcluido=true)', async () => {
      const concluido = makeInstrumento({
        modeloMadeira: 'Violão',
        reparoConcluido: true,
        luthierId: 1,
      });
      instrumentoRepo.findAll.mockResolvedValue([concluido]);
      instrumentoRepo.create.mockResolvedValue(makeInstrumento());

      const p = defaultParams();
      await expect(
        service.create(
          p.modeloMadeira,
          p.dataEntrada,
          p.reparoConcluido,
          p.custoReparo,
          p.luthierId,
        ),
      ).resolves.toBeDefined();
    });

    it('deve permitir mesmo modelo em reparo para luthiers diferentes', async () => {
      const outroLuthier = makeInstrumento({
        modeloMadeira: 'Violão',
        reparoConcluido: false,
        luthierId: 99,
      });
      instrumentoRepo.findAll.mockResolvedValue([outroLuthier]);
      instrumentoRepo.create.mockResolvedValue(makeInstrumento());

      const p = defaultParams();
      await expect(
        service.create(
          p.modeloMadeira,
          p.dataEntrada,
          p.reparoConcluido,
          p.custoReparo,
          1,
        ),
      ).resolves.toBeDefined();
    });
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('deve retornar a lista de instrumentos', async () => {
      const list = [makeInstrumento()];
      instrumentoRepo.findAll.mockResolvedValue(list);

      const result = await service.findAll();
      expect(result).toBe(list);
    });
  });

  // ─── findById ─────────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('deve retornar o instrumento quando encontrado', async () => {
      const instrumento = makeInstrumento();
      instrumentoRepo.findById.mockResolvedValue(instrumento);

      const result = await service.findById(1);
      expect(result).toBe(instrumento);
    });

    it('INSTRUMENTO_006 – deve lançar exceção quando não encontrado', async () => {
      instrumentoRepo.findById.mockResolvedValue(null);
      await expect(service.findById(99)).rejects.toMatchObject({
        code: 'INSTRUMENTO_006',
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  // ─── deactivate ───────────────────────────────────────────────────────────

  describe('deactivate()', () => {
    it('deve marcar o reparo como concluído', async () => {
      const instrumento = makeInstrumento({ reparoConcluido: false });
      const updated = makeInstrumento({ reparoConcluido: true });
      instrumentoRepo.findById.mockResolvedValue(instrumento);
      instrumentoRepo.update.mockResolvedValue(updated);

      const result = await service.deactivate(1);
      expect(instrumento.reparoConcluido).toBe(true);
      expect(instrumentoRepo.update).toHaveBeenCalledWith(instrumento);
      expect(result).toBe(updated);
    });

    it('INSTRUMENTO_006 – deve lançar exceção quando não encontrado', async () => {
      instrumentoRepo.findById.mockResolvedValue(null);
      await expect(service.deactivate(99)).rejects.toMatchObject({
        code: 'INSTRUMENTO_006',
      });
    });
  });

  // ─── delete ───────────────────────────────────────────────────────────────

  describe('delete()', () => {
    it('deve deletar o instrumento existente', async () => {
      instrumentoRepo.findById.mockResolvedValue(makeInstrumento());
      instrumentoRepo.delete.mockResolvedValue(undefined);

      await service.delete(1);
      expect(instrumentoRepo.delete).toHaveBeenCalledWith(1);
    });

    it('INSTRUMENTO_006 – deve lançar exceção quando não encontrado', async () => {
      instrumentoRepo.findById.mockResolvedValue(null);
      await expect(service.delete(99)).rejects.toMatchObject({
        code: 'INSTRUMENTO_006',
      });
    });
  });
});
