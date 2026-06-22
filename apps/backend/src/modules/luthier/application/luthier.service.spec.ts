import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { LuthierService } from './luthier.service';

import type {
  LuthierRepositoryPort,
  LuthierComInstrumentos,
} from './ports/luthier.repository.port';
import { Luthier } from '../domain/luthier';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeLuthier = (overrides: Partial<Luthier> = {}): Luthier =>
  Object.assign(
    new Luthier(1, 'João Silva', new Date('2010-01-01'), true, 3),
    overrides,
  );

const makeMockRepo = (): jest.Mocked<LuthierRepositoryPort> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdWithInstrumentos: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('LuthierService', () => {
  let service: LuthierService;
  let repo: jest.Mocked<LuthierRepositoryPort>;

  beforeEach(async () => {
    repo = makeMockRepo();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LuthierService,
        { provide: 'LuthierRepositoryPort', useValue: repo },
      ],
    }).compile();

    service = module.get<LuthierService>(LuthierService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create()', () => {
    const validParams = () => ({
      nomeMestre: 'João Silva',
      dataAbertura: new Date('2010-01-01'),
      certificada: true,
      bancadasNum: 3,
    });

    it('deve criar um luthier com dados válidos', async () => {
      const luthier = makeLuthier();
      repo.create.mockResolvedValue(luthier);

      const { nomeMestre, dataAbertura, certificada, bancadasNum } =
        validParams();
      const result = await service.create(
        nomeMestre,
        dataAbertura,
        certificada,
        bancadasNum,
      );

      expect(repo.create).toHaveBeenCalledTimes(1);
      expect(result).toBe(luthier);
    });

    it('LUTHIER_002 – deve lançar exceção quando bancadasNum < 2', async () => {
      const { nomeMestre, dataAbertura, certificada } = validParams();
      await expect(
        service.create(nomeMestre, dataAbertura, certificada, 1),
      ).rejects.toMatchObject({ code: 'LUTHIER_002' });
    });

    it('LUTHIER_003 – deve lançar exceção quando bancadasNum não for inteiro', async () => {
      const { nomeMestre, dataAbertura, certificada } = validParams();
      await expect(
        service.create(nomeMestre, dataAbertura, certificada, 2.5),
      ).rejects.toMatchObject({ code: 'LUTHIER_003' });
    });

    it('LUTHIER_004 – deve lançar exceção quando nomeMestre tiver apenas um nome', async () => {
      const { dataAbertura, certificada, bancadasNum } = validParams();
      await expect(
        service.create('Joao', dataAbertura, certificada, bancadasNum),
      ).rejects.toMatchObject({ code: 'LUTHIER_004' });
    });

    it('LUTHIER_005 – deve lançar exceção quando dataAbertura for futura', async () => {
      const { nomeMestre, certificada, bancadasNum } = validParams();
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      await expect(
        service.create(nomeMestre, futureDate, certificada, bancadasNum),
      ).rejects.toMatchObject({ code: 'LUTHIER_005' });
    });

    it('LUTHIER_006 – deve lançar exceção quando dataAbertura for anterior a 1900', async () => {
      const { nomeMestre, certificada, bancadasNum } = validParams();
      await expect(
        service.create(
          nomeMestre,
          new Date('1899-12-31'),
          certificada,
          bancadasNum,
        ),
      ).rejects.toMatchObject({ code: 'LUTHIER_006' });
    });

    it('LUTHIER_001 – deve lançar exceção quando nomeMestre for vazio', async () => {
      const { dataAbertura, certificada, bancadasNum } = validParams();
      await expect(
        service.create('', dataAbertura, certificada, bancadasNum),
      ).rejects.toMatchObject({ code: 'LUTHIER_001' });
    });
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll()', () => {
    it('deve retornar a lista de luthiers', async () => {
      const list = [makeLuthier()];
      repo.findAll.mockResolvedValue(list);

      const result = await service.findAll();
      expect(result).toBe(list);
    });
  });

  // ─── findById ─────────────────────────────────────────────────────────────

  describe('findById()', () => {
    it('deve retornar o luthier quando encontrado', async () => {
      const luthier = makeLuthier();
      repo.findById.mockResolvedValue(luthier);

      const result = await service.findById(1);
      expect(result).toBe(luthier);
    });

    it('LUTHIER_007 – deve lançar exceção quando não encontrado', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.findById(99)).rejects.toMatchObject({
        code: 'LUTHIER_007',
        status: HttpStatus.NOT_FOUND,
      });
    });
  });

  // ─── findWithInstrumentos ────────────────────────────────────────────────

  describe('findWithInstrumentos()', () => {
    it('deve retornar o luthier com instrumentos', async () => {
      const luthierComInstrumentos: LuthierComInstrumentos = {
        ...makeLuthier(),
        instrumentos: [],
      };
      repo.findByIdWithInstrumentos.mockResolvedValue(luthierComInstrumentos);

      const result = await service.findWithInstrumentos(1);
      expect(result).toBe(luthierComInstrumentos);
    });

    it('LUTHIER_007 – deve lançar exceção quando não encontrado', async () => {
      repo.findByIdWithInstrumentos.mockResolvedValue(null);
      await expect(service.findWithInstrumentos(99)).rejects.toMatchObject({
        code: 'LUTHIER_007',
      });
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update()', () => {
    it('deve atualizar o luthier com dados válidos', async () => {
      const existing = makeLuthier();
      const updated = makeLuthier({ nomeMestre: 'Carlos Mendes' });
      repo.findById.mockResolvedValue(existing);
      repo.update.mockResolvedValue(updated);

      const result = await service.update(
        1,
        'Carlos Mendes',
        new Date('2010-01-01'),
        true,
        3,
      );
      expect(repo.update).toHaveBeenCalledTimes(1);
      expect(result).toBe(updated);
    });

    it('LUTHIER_007 – deve lançar exceção quando luthier não existe', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(
        service.update(99, 'Carlos Mendes', new Date('2010-01-01'), true, 3),
      ).rejects.toMatchObject({ code: 'LUTHIER_007' });
    });

    it('LUTHIER_002 – deve lançar exceção quando bancadas < 2 no update', async () => {
      repo.findById.mockResolvedValue(makeLuthier());
      await expect(
        service.update(1, 'Carlos Mendes', new Date('2010-01-01'), true, 1),
      ).rejects.toMatchObject({ code: 'LUTHIER_002' });
    });

    it('LUTHIER_004 – deve lançar exceção quando nome incompleto no update', async () => {
      repo.findById.mockResolvedValue(makeLuthier());
      await expect(
        service.update(1, 'Carlos', new Date('2010-01-01'), true, 3),
      ).rejects.toMatchObject({ code: 'LUTHIER_004' });
    });
  });

  // ─── deactivate ───────────────────────────────────────────────────────────

  describe('deactivate()', () => {
    it('deve desativar a certificação do luthier', async () => {
      const luthier = makeLuthier({ certificada: true });
      const deactivated = makeLuthier({ certificada: false });
      repo.findById.mockResolvedValue(luthier);
      repo.update.mockResolvedValue(deactivated);

      const result = await service.deactivate(1);
      expect(luthier.certificada).toBe(false);
      expect(repo.update).toHaveBeenCalledWith(luthier);
      expect(result).toBe(deactivated);
    });

    it('LUTHIER_007 – deve lançar exceção quando não encontrado', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.deactivate(99)).rejects.toMatchObject({
        code: 'LUTHIER_007',
      });
    });
  });

  // ─── delete ───────────────────────────────────────────────────────────────

  describe('delete()', () => {
    it('deve deletar o luthier existente', async () => {
      repo.findById.mockResolvedValue(makeLuthier());
      repo.delete.mockResolvedValue(undefined);

      await service.delete(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('LUTHIER_007 – deve lançar exceção quando não encontrado', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.delete(99)).rejects.toMatchObject({
        code: 'LUTHIER_007',
      });
    });
  });
});
