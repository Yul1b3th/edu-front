import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { GeoJSONDistrict } from '@interfaces/geoJsonDistrict';
import { InfantilData } from '@interfaces/infantil.interface';
import { PrimaryData } from '@interfaces/primary.interface';
import { SecondaryData } from '@interfaces/secondary.interface';
import { CentreFiltersService } from '@services/centre-filters.service';
import { EduService } from '@services/edu.service';

import { Map, Marker, LngLat, LngLatBounds, Popup } from 'mapbox-gl';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private readonly centreFiltersService = inject(CentreFiltersService);
  private http = inject(HttpClient);
  private eduService = inject(EduService);

  private markers: Marker[] = [];
  public map?: Map;

  // Coordenadas iniciales de la ciudad de Barcelona
  public lngLat: [number, number] = [2.17, 41.33];

  private defaultZoom: number = 10.7;

  @ViewChild('map', { static: false }) divMap?: ElementRef;

  constructor() {
    // Reaccionar a los cambios en la señal selectedCentre
    effect(() => {
      const selectedCentre = this.centreFiltersService.selectedCentre();
      console.log('Selected Centre changed:', selectedCentre);
      this.updateMapBasedOnSelectedCentre(selectedCentre);
    });
  }

  ngAfterViewInit(): void {
    // Verifica si el elemento HTML existe antes de inicializar el mapa
    if (!this.divMap)
      throw new Error('El elemento HTML del mapa no fue encontrado');
    this.initializeMap();
    // Listener para redimensionar
    window.addEventListener('resize', () => {
      this.updateMapOnResize();
    });

    // Inicializar mapa en el tamaño adecuado
    this.updateMapOnResize();
  }

  // Inicializa el mapa de Mapbox
  private initializeMap(): void {
    this.map = new Map({
      container: this.divMap?.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.lngLat,
      zoom: 10.7,
    });

    this.map.on('load', () => {
      this.loadDistrictsBoundary();
    });
  }

  // Cargar límites de los distritos y establecer capas en el mapa
  private loadDistrictsBoundary(): void {
    this.http
      .get<GeoJSONDistrict[]>('/barcelona-distritos.json')
      .subscribe((data: GeoJSONDistrict[]) => {
        const geojsonData = this.convertToGeoJson(data);

        this.map?.addSource('distritos', {
          type: 'geojson',
          data: geojsonData,
        });

        this.map?.addLayer({
          id: 'distritos-fill',
          type: 'fill',
          source: 'distritos',
          paint: {
            'fill-color': '#ccc',
            'fill-opacity': 0.6,
          },
        });

        this.map?.addLayer({
          id: 'distritos-line',
          type: 'line',
          source: 'distritos',
          paint: {
            'line-color': '#000',
            'line-width': 2,
          },
        });

        this.loadRentaDataAndUpdateMap();
      });
  }

  // Función para convertir los datos de distritos a GeoJSON
  private convertToGeoJson(data: GeoJSONDistrict[]): any {
    return {
      type: 'FeatureCollection',
      features: data.map((distrito) => ({
        type: 'Feature',
        properties: {
          nombre: distrito.nom_districte,
          id: distrito.Codi_Districte,
          valor: 0,
        },
        geometry: {
          type: 'Polygon',
          coordinates: this.convertCoordinates(distrito.geometria_wgs84),
        },
      })),
    };
  }

  // Convierte las coordenadas WGS84 en un array de arrays de coordenadas
  private convertCoordinates(geometryString: string): any[] {
    return [
      geometryString
        .replace('POLYGON ((', '')
        .replace('))', '')
        .split(', ')
        .map((pair) => pair.split(' ').map(Number)),
    ];
  }

  // Cargar los datos de renta y actualizar el mapa
  private loadRentaDataAndUpdateMap(): void {
    this.eduService.getRentaData().subscribe((rentaData: any) => {
      const source = this.map?.getSource('distritos') as mapboxgl.GeoJSONSource;
      if (source) {
        const updatedFeatures = (
          source._data as GeoJSON.FeatureCollection
        ).features.map((feature: any) => {
          const renta = rentaData.find(
            (r: any) =>
              r.id.toString().padStart(2, '0') === feature.properties.id,
          );
          return {
            ...feature,
            properties: {
              ...feature.properties,
              valor: renta ? renta.valor : feature.properties.valor,
              colorIndex: renta
                ? renta.colorIndex
                : feature.properties.colorIndex,
            },
          };
        });
        source.setData({
          type: 'FeatureCollection',
          features: updatedFeatures,
        });
        this.setFillColorBasedOnRenta();
      }
    });
  }

  // Configura el color del mapa en función de los datos de renta
  private setFillColorBasedOnRenta(): void {
    this.map?.setPaintProperty('distritos-fill', 'fill-color', [
      'interpolate',
      ['linear'],
      ['get', 'valor'],
      35000,
      '#f28cb1',
      45000,
      '#3bb2d0',
      55000,
      '#2a9d8f',
      65000,
      '#e9c46a',
      80000,
      '#e76f51',
    ]);
  }

  // Llamadas de actualización del mapa basadas en el centro seleccionado
  private updateMapBasedOnSelectedCentre(selectedCentre: string): void {
    this.clearMarkers();
    if (selectedCentre === 'Infantil') {
      this.loadCentreDataAndAddMarkers('infantil', 'blue');
    } else if (selectedCentre === 'Primaria') {
      this.loadCentreDataAndAddMarkers('primary', 'green');
    } else if (selectedCentre === 'Secundària') {
      this.loadCentreDataAndAddMarkers('secondary', 'orange');
    }
  }

  // Cargar los datos de un centro y añadir los marcadores
  private loadCentreDataAndAddMarkers(centreType: string, color: string): void {
    const dataLoader = {
      infantil: this.eduService.getInfantilData(),
      primary: this.eduService.getPrimaryData(),
      secondary: this.eduService.getSecondaryData(),
    }[centreType];

    dataLoader!.subscribe((data: any[]) => {
      data.forEach((distrito) => {
        const coordinates = this.getDistrictCoordinates(distrito.name);
        if (coordinates) {
          const marker = new Marker({
            color: color,
            scale: distrito.percentage ? distrito.percentage / 10 : 1,
          })
            .setLngLat(coordinates)
            .addTo(this.map!)
            .setPopup(
              new Popup({ offset: 25 }).setHTML(
                `<h4>${distrito.name}</h4>
                <p><strong>Total:</strong> ${distrito.total}</p>
                <p><strong>Percentage:</strong> ${distrito.percentage.toFixed(2)}%</p>`,
              ),
            );
          this.markers.push(marker);
        }
      });
    });
  }

  // Elimina todos los marcadores del mapa
  private clearMarkers(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }

  // Obtener las coordenadas de un distrito
  private getDistrictCoordinates(
    districtName: string,
  ): [number, number] | null {
    const districtCoordinates: { [key: string]: [number, number] } = {
      'Ciutat Vella': [2.1734, 41.3851],
      Gràcia: [2.15899, 41.4096],
      'Horta-Guinardó': [2.1651, 41.4298],
      Eixample: [2.162, 41.3888],
      'Les Corts': [2.1319, 41.3818],
      'Nou Barris': [2.1774, 41.4416],
      'Sant Andreu': [2.1911, 41.4351],
      'Sant Martí': [2.1995, 41.4186],
      'Sants-Montjuïc': [2.1419, 41.3723],
      'Sarrià-Sant Gervasi': [2.1343, 41.401],
    };
    return districtCoordinates[districtName] || null;
  }

  private updateMapOnResize(): void {
    console.log('Resizing map');

    if (this.map) {
      const windowWidth = window.innerWidth;

      if (windowWidth >= 767.98) {
        // Configuraciones para dispositivos móviles
        this.map.setZoom(10.7); // Ajusta el zoom para móviles
        this.lngLat = [2.32, 41.33];
        this.map.setCenter(this.lngLat); // Re-centra el mapa
      } else {
        // Configuraciones para otros dispositivos
        this.map.setZoom(this.defaultZoom); // Ajusta el zoom para desktop
        this.map.setCenter(this.lngLat); // Re-centra el mapa
      }

      this.map.resize(); // Ajusta el tamaño del mapa al nuevo tamaño de la ventana
    }
  }
}
