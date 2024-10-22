import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Data } from '@interfaces/data';

import { Observable, tap } from 'rxjs';

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

  getInfantilData(): Observable<Data[]> {
    return this.http
      .get<Data[]>(`${this.baseUrl}/districts/infantil`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }

  getPrimaryData(): Observable<Data[]> {
    return this.http
      .get<Data[]>(`${this.baseUrl}/districts/primary`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }

  getSecondaryData(): Observable<Data[]> {
    return this.http
      .get<Data[]>(`${this.baseUrl}/districts/secondary`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }
}
