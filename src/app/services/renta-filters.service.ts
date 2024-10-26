import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RentaFiltersService {
  selectedRenta = signal<string | null>(null);
}
