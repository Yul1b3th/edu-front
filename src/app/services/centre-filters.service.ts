import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CentreFiltersService {
  public readonly selectedCentre = signal<string>('');
}
