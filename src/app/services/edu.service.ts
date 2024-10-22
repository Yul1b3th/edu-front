import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Renta } from '@interfaces/rent';

import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EduService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getRentaData(): Observable<Renta[]> {
    return this.http
      .get<Renta[]>(`${this.baseUrl}/districts`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }

  getInfantilData(): Observable<Renta[]> {
    return this.http
      .get<Renta[]>(`${this.baseUrl}//districts/infantil`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }

  getPrimaryData(): Observable<Renta[]> {
    return this.http
      .get<Renta[]>(`${this.baseUrl}/primary`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }

  getSecondaryData(): Observable<Renta[]> {
    return this.http
      .get<Renta[]>(`${this.baseUrl}/secondary`)
      .pipe(tap((data) => console.log('Renta data:', data)));
  }
}
