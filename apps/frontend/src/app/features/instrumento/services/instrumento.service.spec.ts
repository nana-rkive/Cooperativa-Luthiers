import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

import { InstrumentoService } from './instrumento.service';
import { CreateInstrumentoDto, InstrumentoDto, UpdateInstrumentoDto } from '@luthiers/utils';

describe('InstrumentoService', () => {
  let service: InstrumentoService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/instrumentos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        InstrumentoService
      ]
    });
    service = TestBed.inject(InstrumentoService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get all instrumentos', () => {
    const mockInstrumentos: InstrumentoDto[] = [
      { id: 1, modeloMadeira: 'Violão', dataEntrada: '2020-01-01', reparoConcluido: false, custoReparo: 500, luthierId: 1 }
    ];

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockInstrumentos);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockInstrumentos);
  });

  it('should get instrumento by id', () => {
    const mockInstrumento: InstrumentoDto = { id: 1, modeloMadeira: 'Violão', dataEntrada: '2020-01-01', reparoConcluido: false, custoReparo: 500, luthierId: 1 };

    service.getById(1).subscribe(data => {
      expect(data).toEqual(mockInstrumento);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockInstrumento);
  });

  it('should create instrumento', () => {
    const dto: CreateInstrumentoDto = { modeloMadeira: 'Violão', dataEntrada: '2020-01-01', reparoConcluido: false, custoReparo: 500, luthierId: 1 };
    const mockInstrumento: InstrumentoDto = { id: 1, ...dto };

    service.create(dto).subscribe(data => {
      expect(data).toEqual(mockInstrumento);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockInstrumento);
  });

  it('should update instrumento', () => {
    const dto: UpdateInstrumentoDto = { modeloMadeira: 'Guitarra' };
    const mockInstrumento: InstrumentoDto = { id: 1, modeloMadeira: 'Guitarra', dataEntrada: '2020-01-01', reparoConcluido: false, custoReparo: 500, luthierId: 1 };

    service.update(1, dto).subscribe(data => {
      expect(data).toEqual(mockInstrumento);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);
    req.flush(mockInstrumento);
  });

  it('should delete instrumento', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
