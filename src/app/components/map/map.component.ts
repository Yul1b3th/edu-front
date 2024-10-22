import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, inject } from '@angular/core';
import { environment } from '@environments/environment.development';
import { EduService } from '@services/edu.service';
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

  private http = inject(HttpClient);
  private eduService = inject(EduService);

  ngAfterViewInit(): void {
    // Inicializa el mapa
    this.map = new mapboxgl.Map({
      accessToken: environment.mapboxToken,
      container: 'map', // ID del contenedor en el HTML
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [2.1734, 41.3851], // Coordenadas de Barcelona
      zoom: 12,
    });

    // Cargar los datos de los límites de los distritos desde el archivo JSON
    this.map.on('load', () => {
      this.http.get('/barcelona-distritos.json').subscribe((data: any) => {
        const geojsonData = this.convertToGeoJson(data);

        this.map.addSource('distritos', {
          type: 'geojson',
          data: geojsonData,
        });

        this.map.addLayer({
          id: 'distritos-fill',
          type: 'fill',
          source: 'distritos',
          paint: {
            'fill-color': '#ccc', // Color inicial, se actualizará luego
            'fill-opacity': 0.6,
          },
        });

        // Añadir un borde a los distritos
        this.map.addLayer({
          id: 'distritos-line',
          type: 'line',
          source: 'distritos',
          paint: {
            'line-color': '#000',
            'line-width': 2,
          },
        });

        // Después de agregar los límites de los distritos, obtener los datos del backend
        this.loadRentaDataAndUpdateMap();
      });
    });
  }

  // Función para convertir los datos del JSON a un formato GeoJSON
  convertToGeoJson(data: any[]): any {
    const features = data.map((distrito) => ({
      type: 'Feature',
      properties: {
        nombre: distrito.nom_districte,
        id: distrito.Codi_Districte,
        valor: 0, // Valor inicial por defecto
      },
      geometry: {
        type: 'Polygon',
        coordinates: this.convertCoordinates(distrito.geometria_wgs84),
      },
    }));

    return {
      type: 'FeatureCollection',
      features: features,
    };
  }

  // Función para convertir las coordenadas en formato WGS84 a un array de arrays de coordenadas
  convertCoordinates(geometryString: string): any[] {
    const coordinatesString = geometryString
      .replace('POLYGON ((', '')
      .replace('))', '')
      .split(', ');

    const coordinates = coordinatesString.map((pair) => {
      const [long, lat] = pair.split(' ').map(Number);
      return [long, lat];
    });

    return [coordinates];
  }

  // Cargar los datos de la renta per cápita desde el backend y actualizar el mapa
  // Cargar los datos de la renta per cápita desde el backend y actualizar el mapa
  loadRentaDataAndUpdateMap(): void {
    this.eduService.getRentaData().subscribe((rentaData: any) => {
      const source = this.map.getSource('distritos') as mapboxgl.GeoJSONSource;

      if (source) {
        // Actualizar los datos de GeoJSON con la renta per cápita y asignar el colorIndex
        const updatedFeatures = (source._data as GeoJSON.FeatureCollection).features.map((feature: any) => {
          const renta = rentaData.find((r: any) => {
            // Asegurarse de que los IDs estén en el mismo formato para la comparación
            return r.id.toString().padStart(2, '0') === feature.properties.id;
          });

          return {
            ...feature,
            properties: {
              ...feature.properties,
              valor: renta ? renta.valor : feature.properties.valor,
              colorIndex: renta ? renta.colorIndex : feature.properties.colorIndex,
            },
          };
        });

        // Verificar si los valores se están asignando correctamente
        console.log('Updated Features:', updatedFeatures);

        // Asegurarse de actualizar la fuente correctamente
        source.setData({
          type: 'FeatureCollection',
          features: updatedFeatures,
        });

        // Actualizar los colores de los distritos en función de la renta
        this.map.setPaintProperty('distritos-fill', 'fill-color', [
          'interpolate',
          ['linear'],
          ['get', 'valor'],
          35000, '#f28cb1',  // Color para valores bajos (rosa)
          45000, '#3bb2d0',  // Color para valores medios (azul claro)
          55000, '#2a9d8f',  // Color adicional para valores altos (verde esmeralda)
          65000, '#e9c46a',  // Color adicional para valores muy altos (amarillo claro)
          80000, '#e76f51'   // Color para valores extremadamente altos (naranja)
        ]);
      }
    });
  }



}
