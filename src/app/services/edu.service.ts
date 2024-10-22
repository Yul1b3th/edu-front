import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment.development';
import { Renta } from '@interfaces/rent';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EduService {

  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  getRentaData(): Observable<Renta[]> {
    return this.http.get<Renta[]>(`${this.baseUrl}`);
  }



}
