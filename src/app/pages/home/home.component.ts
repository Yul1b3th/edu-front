import { Component, inject } from '@angular/core';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';

import { MapComponent } from '@components/map/map.component';
import { CentreFiltersService } from '@services/centre-filters.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly centreFiltersService = inject(CentreFiltersService);

  activeButton: HTMLElement | null = null;

  handleClick(event: Event) {
    const button = (event.target as HTMLElement).closest('button');

    if (this.activeButton) {
      this.activeButton.classList.remove('active');
    }

    if (button) {
      button.classList.add('active');
      this.activeButton = button;

      // Mostrar el contenido del botón por consola
      const buttonText = button.textContent?.trim();
      // console.log(buttonText);

      // Actualizar la señal con el valor del botón
      if (buttonText) {
        this.centreFiltersService.selectedCentre.set(buttonText);
        console.log(this.centreFiltersService.selectedCentre());
      }
    }
  }
}
