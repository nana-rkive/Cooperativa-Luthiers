import { Test, TestingModule } from '@nestjs/testing';
import { LuthierController } from './luthier.controller';
import { LuthierService } from '../application/luthier.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../usuario/infrastructure/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Luthier } from '../domain/luthier';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeLuthier = (): Luthier =>
  new Luthier(1, 'João Silva', new Date('2010-01-01'), true, 3);

const makeMockService = (): jest.Mocked<LuthierService> =>
  ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findWithInstrumentos: jest.fn(),
    update: jest.fn(),
    deactivate: jest.fn(),
    delete: jest.fn(),
  }) as any;

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('LuthierController', () => {
  let controller: LuthierController;
  let service: jest.Mocked<LuthierService>;

  beforeEach(async () => {
    service = makeMockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LuthierController],
      providers: [{ provide: LuthierService, useValue: service }, Reflector],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<LuthierController>(LuthierController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create()', () => {
    it('deve chamar service.create com os parâmetros corretos', async () => {
      const luthier = makeLuthier();
      service.create.mockResolvedValue(luthier);

      const dto = {
        nomeMestre: 'João Silva',
        dataAbertura: new Date('2010-01-01'),
        certificada: true,
        bancadasNum: 3,
      };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(
        'João Silva',
        new Date('2010-01-01'),
        true,
        3,
      );
      expect(result).toBe(luthier);
    });
  });

  describe('findAll()', () => {
    it('deve retornar a lista de luthiers', async () => {
      const list = [makeLuthier()];
      service.findAll.mockResolvedValue(list);

      const result = await controller.findAll();
      expect(result).toBe(list);
    });
  });

  describe('findById()', () => {
    it('deve chamar service.findById com o id convertido', async () => {
      const luthier = makeLuthier();
      service.findById.mockResolvedValue(luthier);

      const result = await controller.findById('1');
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(luthier);
    });
  });

  describe('findWithInstrumentos()', () => {
    it('deve chamar service.findWithInstrumentos com o id correto', async () => {
      const data = { ...makeLuthier(), instrumentos: [] };
      service.findWithInstrumentos.mockResolvedValue(data as any);

      const result = await controller.findWithInstrumentos('1');
      expect(service.findWithInstrumentos).toHaveBeenCalledWith(1);
      expect(result).toBe(data);
    });
  });

  describe('update()', () => {
    it('deve chamar service.update com os parâmetros corretos', async () => {
      const luthier = makeLuthier();
      service.update.mockResolvedValue(luthier);

      const dto = {
        nomeMestre: 'Carlos Mendes',
        dataAbertura: new Date('2010-01-01'),
        certificada: false,
        bancadasNum: 4,
      };
      const result = await controller.update('1', dto);

      expect(service.update).toHaveBeenCalledWith(
        1,
        'Carlos Mendes',
        new Date('2010-01-01'),
        false,
        4,
      );
      expect(result).toBe(luthier);
    });
  });

  describe('deactivate()', () => {
    it('deve chamar service.deactivate com o id correto', async () => {
      const luthier = makeLuthier();
      service.deactivate.mockResolvedValue(luthier);

      const result = await controller.deactivate('1');
      expect(service.deactivate).toHaveBeenCalledWith(1);
      expect(result).toBe(luthier);
    });
  });

  describe('delete()', () => {
    it('deve chamar service.delete com o id correto', async () => {
      service.delete.mockResolvedValue(undefined);

      await controller.delete('1');
      expect(service.delete).toHaveBeenCalledWith(1);
    });
  });
});
