import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActivityFiltersService {
  public readonly selectedActivity = signal<string>('');
}
