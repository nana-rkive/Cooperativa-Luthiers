import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LuthierService } from './luthier.service';
import { CreateLuthierDto, LuthierDto, UpdateLuthierDto } from '@luthiers/utils';

describe('LuthierService', () => {
  let service: LuthierService;
  let httpTestingController: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/luthiers`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        LuthierService
      ]
    });
    service = TestBed.inject(LuthierService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should get all luthiers', () => {
    const mockLuthiers: LuthierDto[] = [
      { id: '1', nomeMestre: 'João', dataAbertura: '2020-01-01', certificada: true, bancadasNum: 2 }
    ];

    service.getAll().subscribe(data => {
      expect(data).toEqual(mockLuthiers);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockLuthiers);
  });

  it('should get luthier by id', () => {
    const mockLuthier: LuthierDto = { id: '1', nomeMestre: 'João', dataAbertura: '2020-01-01', certificada: true, bancadasNum: 2 };

    service.getById('1').subscribe(data => {
      expect(data).toEqual(mockLuthier);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockLuthier);
  });

  it('should create luthier', () => {
    const dto: CreateLuthierDto = { nomeMestre: 'João', dataAbertura: '2020-01-01', certificada: true, bancadasNum: 2 };
    const mockLuthier: LuthierDto = { id: '1', ...dto };

    service.create(dto).subscribe(data => {
      expect(data).toEqual(mockLuthier);
    });

    const req = httpTestingController.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);
    req.flush(mockLuthier);
  });

  it('should update luthier', () => {
    const dto: UpdateLuthierDto = { nomeMestre: 'João Atualizado' };
    const mockLuthier: LuthierDto = { id: '1', nomeMestre: 'João Atualizado', dataAbertura: '2020-01-01', certificada: true, bancadasNum: 2 };

    service.update('1', dto).subscribe(data => {
      expect(data).toEqual(mockLuthier);
    });

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual(dto);
    req.flush(mockLuthier);
  });

  it('should delete luthier', () => {
    service.delete('1').subscribe();

    const req = httpTestingController.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
