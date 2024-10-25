import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { environment } from '@environments/environment.development';
import { Data } from '@interfaces/data';
import { InfantilData } from '@interfaces/infantil.interface';
import { PrimaryData } from '@interfaces/primary.interface';
import { SecondaryData } from '@interfaces/secondary.interface';

@Injectable({
  providedIn: 'root',
})
export class EduService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getRentaData(): Observable<Data[]> {
    return this.http
      .get<Data[]>(`${this.baseUrl}/districts`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }

  getInfantilData(): Observable<InfantilData[]> {
    return this.http
      .get<InfantilData[]>(`${this.baseUrl}/districts/infantil`)
      .pipe(tap((data) => console.log('Infantil data:', data)));
  }

  getPrimaryData(): Observable<PrimaryData[]> {
    return this.http
      .get<PrimaryData[]>(`${this.baseUrl}/districts/primary`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }

  getSecondaryData(): Observable<SecondaryData[]> {
    return this.http
      .get<SecondaryData[]>(`${this.baseUrl}/districts/secondary`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }
}
