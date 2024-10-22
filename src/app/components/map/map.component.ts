import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject } from '@angular/core';
import { environment } from '@environments/environment.development';
import { MapService } from '@services/map.service';
import mapboxgl, { LngLat, Marker } from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1IjoiYWRwdGNvZGUiLCJhIjoiY20yajNyM2wxMDFoaDJqc2I4dG5keXAzaCJ9.qIRLrPbj_pGnE0QzjbwkUw';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit {
  map!: mapboxgl.Map;
  markers: any[] = [];
  private http = inject(HttpClient);
  private mapService = inject(MapService)

  ngAfterViewInit(): void {

    this.markers = this.mapService.coordenadasDistritos;

    for (let i = 0; i < this.markers.length; i++){
      const coordinates: LngLat = new LngLat(
        this.markers[i].long,
        this.markers[i].lat
      );
      const markerHtml = document.createElement('div');
      markerHtml.className = 'marker';
      markerHtml.innerHTML = this.markers[i].name

      const marker = new Marker({
        element: markerHtml,
      })
        .setLngLat(coordinates)
        .addTo(this.map);
    };


    // Inicializa el mapa
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxToken,
      container: 'map', // ID del contenedor en el HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1734, 41.3851], // Coordenadas de Barcelona
      zoom: 12
    });

    // Cargar los datos del JSON y añadir la capa al mapa
    this.map.on('load', () => {
      this.http.get('/barcelona-distritos.json').subscribe((data: any) => {
        const geojsonData = this.convertToGeoJson(data);
        this.map.addSource('distritos', {
          type: 'geojson',
          data: geojsonData
        });

        this.map.addLayer({
          id: 'distritos-fill',
          type: 'fill',
          source: 'distritos',
          paint: {
            'fill-color': [
              'interpolate',
              ['linear'],
              ['get', 'valor'],
              20000, '#f28cb1',  // Color para valores bajos
              30000, '#3bb2d0',  // Color para valores medios
              40000, '#3887be'   // Color para valores altos
            ],
            'fill-opacity': 0.6
          }
        });

        // Añadir un borde a los distritos
        this.map.addLayer({
          id: 'distritos-line',
          type: 'line',
          source: 'distritos',
          paint: {
            'line-color': '#000',
            'line-width': 2
          }
        });
      });
    });
  }

  // Función para convertir los datos del JSON a un formato GeoJSON
  convertToGeoJson(data: any[]): any {
    const features = data.map(distrito => ({
      type: 'Feature',
      properties: {
        nombre: distrito.nom_districte,
        valor: Math.random() * 40000 // Puedes ajustar el valor según sea necesario o usar el campo adecuado del JSON
      },
      geometry: {
        type: 'Polygon',
        coordinates: this.convertCoordinates(distrito.geometria_wgs84)
      }
    }));

    return {
      type: 'FeatureCollection',
      features: features
    };
  }

  // Función para convertir las coordenadas en formato WGS84 a un array de arrays de coordenadas
  convertCoordinates(geometryString: string): any[] {
    // Ejemplo de cómo transformar la cadena de coordenadas a un array de arrays
    const coordinatesString = geometryString
      .replace('POLYGON ((', '')
      .replace('))', '')
      .split(', ');

    const coordinates = coordinatesString.map(pair => {
      const [long, lat] = pair.split(' ').map(Number);
      return [long, lat];
    });

    return [coordinates];
  }
}
