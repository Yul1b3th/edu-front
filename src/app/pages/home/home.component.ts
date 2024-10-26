import { Component, inject } from '@angular/core';
import { MapComponent } from '@components/map/map.component';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';
import { CentreFiltersService } from '@services/centre-filters.service';
import { RentaFiltersService } from '@services/renta-filters.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  private readonly centreFiltersService = inject(CentreFiltersService);
  private readonly rentaFiltersService = inject(RentaFiltersService);

  activeButton: HTMLElement | null = null;

  handleCentreClick(event: Event) {
    const button = (event.target as HTMLElement).closest('button');

    if (this.activeButton) {
      this.activeButton.classList.remove('active');
    }

    if (button) {
      button.classList.add('active');
      this.activeButton = button;

      // Mostrar el contenido del botón por consola
      const buttonText = button.textContent?.trim();

      // Actualizar la señal con el valor del botón
      if (buttonText) {
        this.centreFiltersService.selectedCentre.set(buttonText);
        console.log(this.centreFiltersService.selectedCentre());
      }
    }
  }

  handleRentaClick(event: Event, rentaRange: string) {
    const button = (event.target as HTMLElement).closest('button');

    if (!button) return;

    const isActive = button.classList.contains('active');

    if (!isActive) {
      button.classList.add('active');
      this.rentaFiltersService.selectedRenta.set(rentaRange);
    } else {
      button.classList.remove('active');
      this.rentaFiltersService.selectedRenta.set(null);
    }
  }
}
