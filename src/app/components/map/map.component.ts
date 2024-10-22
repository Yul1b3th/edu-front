import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { environment } from '@environments/environment.development';
import mapboxgl from 'mapbox-gl';

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

  constructor(private http: HttpClient) {}

  // distritosData = {
  //   "distritos": [
  //     {
  //       "nombre": "Eixample",
  //       "id": 1,
  //       "valor": 30000,
  //       "orden": 3,
  //       "coordinates": [[[2.1527, 41.4036], [2.1677, 41.3833], [2.1773, 41.3879], [2.1623, 41.4082], [2.1527, 41.4036]]]
  //     },
  //     {
  //       "nombre": "Ciutat Vella",
  //       "id": 2,
  //       "valor": 25000,
  //       "orden": 1,
  //       "coordinates": [[[2.1769, 41.3797], [2.1851, 41.3762], [2.1832, 41.3723], [2.1723, 41.3753], [2.1769, 41.3797]]]
  //     },
  //     {
  //       "nombre": "Sants-Montjuïc",
  //       "id": 3,
  //       "valor": 20000,
  //       "orden": 2,
  //       "coordinates": [[[2.1416, 41.3726], [2.1540, 41.3641], [2.1496, 41.3565], [2.1368, 41.3648], [2.1416, 41.3726]]]
  //     },
  //     {
  //       "nombre": "Gràcia",
  //       "id": 4,
  //       "valor": 40000,
  //       "orden": 4,
  //       "coordinates": [[[2.1570, 41.4102], [2.1686, 41.4068], [2.1694, 41.3998], [2.1564, 41.4021], [2.1570, 41.4102]]]
  //     },
  //     {
  //       "nombre": "Sant Martí",
  //       "id": 5,
  //       "valor": 35000,
  //       "orden": 5,
  //       "coordinates": [[[2.1950, 41.4101], [2.2080, 41.4024], [2.2015, 41.3955], [2.1885, 41.4003], [2.1950, 41.4101]]]
  //     }
  //   ]
  // };

  ngAfterViewInit(): void {
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
