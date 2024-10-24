import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EduService } from './edu.service';
import { TestBed } from '@angular/core/testing';
import { environment } from '@environments/environment.development';
import { PrimaryData } from '@interfaces/primary.interface';
import { Data } from '@angular/router';
import { InfantilData } from '@interfaces/infantil.interface';
import { SecondaryData } from '@interfaces/secondary.interface';

describe('EduService', () => {
  let service: EduService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EduService],
    });

    service = TestBed.inject(EduService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch renta data', () => {
    const mockData: Data[] = [
      { id: 1, name: 'Distrito 1', valor: 40000, colorIndex: 1 },
      { id: 2, name: 'Distrito 2', valor: 45000, colorIndex: 2 },
    ];

    service.getRentaData().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(jasmine.arrayContaining(mockData));
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/districts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch infantil data', () => {
    const mockData: InfantilData[] = [
      { id: 1, name: 'Districte A', total: 100, percentage: 75 },
      { id: 2, name: 'Districte B', total: 100, percentage: 50 },
    ];

    service.getInfantilData().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/districts/infantil`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch primary data', () => {
    const mockData: PrimaryData[] = [
      { id: 1, name: 'Districte C', total: 100, percentage: 80 },
    ];

    service.getPrimaryData().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/districts/primary`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should fetch secondary data', () => {
    const mockData: SecondaryData[] = [
      { id: 1, name: 'Districte A', total: 100, percentage: 75 },
      { id: 2, name: 'Districte B', total: 100, percentage: 50 },
    ];

    service.getSecondaryData().subscribe((data) => {
      expect(data.length).toBe(2); // Cambiado de 1 a 2
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(
      `${environment.baseUrl}/districts/secondary`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
