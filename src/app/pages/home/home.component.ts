import { Component, inject } from '@angular/core';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';

import { MapComponent } from '@components/map/map.component';
import { MapService } from '../../services/map.service';
import { SchoolData } from '@interfaces/school-data.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MapComponent, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {

  mapService = inject(MapService);
  schoolData: SchoolData[] = [];

  getData(){
    this.mapService.getSchoolData().subscribe( (data: any) => {
      console.log(data);
      this.schoolData = data;
    })
  }
}
