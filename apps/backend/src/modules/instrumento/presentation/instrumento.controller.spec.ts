import { Test, TestingModule } from '@nestjs/testing';
import { InstrumentoController } from './instrumento.controller';
import { InstrumentoService } from '../application/instrumento.service';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../../usuario/infrastructure/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../shared/guards/roles.guard';
import { Instrumento } from '../domain/instrumento';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeInstrumento = (): Instrumento =>
  new Instrumento(1, 'Violão', new Date('2023-01-01'), false, 100, 1);

const makeMockService = (): jest.Mocked<InstrumentoService> =>
  ({
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    deactivate: jest.fn(),
    delete: jest.fn(),
  }) as any;

// ─── Suite ────────────────────────────────────────────────────────────────────

describe('InstrumentoController', () => {
  let controller: InstrumentoController;
  let service: jest.Mocked<InstrumentoService>;

  beforeEach(async () => {
    service = makeMockService();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstrumentoController],
      providers: [
        { provide: InstrumentoService, useValue: service },
        Reflector,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<InstrumentoController>(InstrumentoController);
  });

  afterEach(() => jest.clearAllMocks());

  describe('create()', () => {
    it('deve chamar service.create com os parâmetros corretos', async () => {
      const instrumento = makeInstrumento();
      service.create.mockResolvedValue(instrumento);

      const dto = {
        modeloMadeira: 'Violão',
        dataEntrada: new Date('2023-01-01'),
        reparoConcluido: false,
        custoReparo: 100,
        luthierId: 1,
      };
      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(
        'Violão',
        new Date('2023-01-01'),
        false,
        100,
        1,
      );
      expect(result).toBe(instrumento);
    });
  });

  describe('findAll()', () => {
    it('deve retornar a lista de instrumentos', async () => {
      const list = [makeInstrumento()];
      service.findAll.mockResolvedValue(list);

      const result = await controller.findAll();
      expect(result).toBe(list);
    });
  });

  describe('findById()', () => {
    it('deve chamar service.findById com o id convertido', async () => {
      const instrumento = makeInstrumento();
      service.findById.mockResolvedValue(instrumento);

      const result = await controller.findById('1');
      expect(service.findById).toHaveBeenCalledWith(1);
      expect(result).toBe(instrumento);
    });
  });

  describe('deactivate()', () => {
    it('deve chamar service.deactivate com o id correto', async () => {
      const instrumento = makeInstrumento();
      service.deactivate.mockResolvedValue(instrumento);

      const result = await controller.deactivate('1');
      expect(service.deactivate).toHaveBeenCalledWith(1);
      expect(result).toBe(instrumento);
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
