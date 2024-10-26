import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Map, Marker, LngLat, LngLatBounds, Popup } from 'mapbox-gl';
import { GeoJSONDistrict } from '@interfaces/geoJsonDistrict';
import { CentreFiltersService } from '@services/centre-filters.service';
import { EduService } from '@services/edu.service';
import { RentaFiltersService } from '@services/renta-filters.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private readonly centreFiltersService = inject(CentreFiltersService);
  private readonly rentaFiltersService = inject(RentaFiltersService);
  private http = inject(HttpClient);
  private eduService = inject(EduService);

  private markers: Marker[] = [];
  public map?: Map;
  private isDataLoaded = false; // Bandera para verificar si los datos están cargados

  // Coordenadas iniciales de la ciudad de Barcelona
  public lngLat: [number, number] = [2.17, 41.33];

  private defaultZoom: number = 10.7;

  @ViewChild('map', { static: false }) divMap?: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor() {
    // Reaccionar a los cambios en la señal selectedCentre
    effect(() => {
      const selectedCentre = this.centreFiltersService.selectedCentre();
      this.updateMapBasedOnSelectedCentre(selectedCentre);
    });

    // Reaccionar a los cambios en la señal selectedRenta
    effect(() => {
      const selectedRenta = this.rentaFiltersService.selectedRenta();
      this.highlightDistrictsByRenta(selectedRenta);
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

  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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

  private loadDistrictsBoundary(): void {
    this.http.get<GeoJSONDistrict[]>('/barcelona-distritos.json').subscribe({
      next: (districtData: GeoJSONDistrict[]) => {
        console.log('Datos de distritos cargados:', districtData);

        // Cargar los datos de renta y combinar con los datos de distritos
        this.eduService.getRentaData().subscribe((rentaData: any) => {
          console.log('Datos de renta cargados:', rentaData);

          // Combinar los datos de renta con los datos de distritos basándote en el nombre del distrito
          const combinedData = districtData.map((district) => {
            const renta = rentaData.find(
              (r: any) => r.name === district.nom_districte
            );
            return {
              ...district,
              valor: renta ? renta.valor : 0,
              colorIndex: renta ? renta.colorIndex : -1,
            };
          });

          console.log('Datos combinados:', combinedData);

          const geojsonData = this.convertToGeoJson(combinedData);

          // Asegurarse de que el mapa esté inicializado
          if (!this.map) {
            console.error('El mapa no está inicializado.');
            return;
          }

          // Añadir la fuente de datos de distritos al mapa
          this.map.addSource('distritos', {
            type: 'geojson',
            data: geojsonData,
          });

          // Añadir la capa de relleno de distritos
          this.map.addLayer({
            id: 'distritos-fill',
            type: 'fill',
            source: 'distritos',
            paint: {
              'fill-color': '#ccc',
              'fill-opacity': 0.6,
            },
          });

          // Añadir la capa de contorno de distritos
          this.map.addLayer({
            id: 'distritos-line',
            type: 'line',
            source: 'distritos',
            paint: {
              'line-color': '#000',
              'line-width': 2,
            },
          });

          // Configurar el color del mapa en función de los datos de renta
          this.setFillColorBasedOnRenta();

          // Establecer la bandera isDataLoaded en true
          this.isDataLoaded = true;
        });
      },
      error: (err) => {
        console.error('Error al cargar los distritos:', err);
      },
    });
  }

  // Configura el color del mapa en función de los datos de renta
  private setFillColorBasedOnRenta(): void {
    const source = this.map?.getSource('distritos') as mapboxgl.GeoJSONSource;
    if (source && typeof source._data !== 'string') {
      const features = (source._data as GeoJSON.FeatureCollection).features;

      // Redondear los valores de renta a los límites de los rangos
      const updatedFeatures = features.map((feature: any) => {
        let valor = feature.properties.valor;
        if (valor <= 40000) {
          valor = 40000;
        } else if (valor <= 50000) {
          valor = 50000;
        } else if (valor <= 60000) {
          valor = 60000;
        } else if (valor <= 80000) {
          valor = 80000;
        } else {
          valor = 100000;
        }
        return {
          ...feature,
          properties: {
            ...feature.properties,
            valor: valor,
          },
        };
      });

      source.setData({
        type: 'FeatureCollection',
        features: updatedFeatures,
      });

      this.map?.setPaintProperty('distritos-fill', 'fill-color', [
        'match',
        ['get', 'valor'],
        40000,
        '#F28CB1', // Hasta 40k -> Rosa claro
        50000,
        '#3BB2D0', // De 40k a 50k -> Azul claro
        60000,
        '#2A9D8F', // De 50k a 60k -> Amarillo claro
        80000,
        '#E9C46A', // De 60k a 80k -> Naranja claro
        100000,
        '#E76F51', // Más de 80k -> Rojo oscuro
        /* default */ '#ccc',
      ]);
    } else {
      console.error('La fuente de datos no está disponible o no es válida.');
    }
  }

  // Función para convertir los datos de distritos a GeoJSON
  private convertToGeoJson(data: any[]): any {
    return {
      type: 'FeatureCollection',
      features: data.map((distrito) => ({
        type: 'Feature',
        properties: {
          nombre: distrito.nom_districte,
          id: distrito.Codi_Districte,
          valor: distrito.valor,
          colorIndex: distrito.colorIndex,
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
                <p><strong>Percentage:</strong> ${distrito.percentage.toFixed(
                  2
                )}%</p>`
              )
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
    districtName: string
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

  // Destacar los distritos con un color más oscuro en función de la renta seleccionada
  private highlightDistrictsByRenta(rentaRange: string | null): void {
    if (!this.isDataLoaded) return;

    const colorMapping: { [key: number]: string } = {
      40000: '#F28CB1', // Hasta 40k -> Rosa claro
      50000: '#3BB2D0', // De 40k a 50k -> Azul claro
      60000: '#2A9D8F', // De 50k a 60k -> Amarillo claro
      80000: '#E9C46A', // De 60k a 80k -> Naranja claro
      100000: '#E76F51', // Más de 80k -> Rojo oscuro
    };

    const highlightColorMapping: { [key: number]: string } = {
      40000: '#D81B60', // Hasta 40k -> Rosa oscuro
      50000: '#1976D2', // De 40k a 50k -> Azul oscuro
      60000: '#00796B', // De 50k a 60k -> Verde oscuro
      80000: '#F57C00', // De 60k a 80k -> Naranja oscuro
      100000: '#C62828', // Más de 80k -> Rojo oscuro
    };

    const source = this.map?.getSource('distritos') as mapboxgl.GeoJSONSource;
    if (source && typeof source._data !== 'string') {
      const features = (source._data as GeoJSON.FeatureCollection).features;

      const updatedFeatures = features.map((feature: any) => {
        const valor = feature.properties.valor;
        const color =
          rentaRange && valor === parseInt(rentaRange)
            ? highlightColorMapping[valor]
            : colorMapping[valor];
        return {
          ...feature,
          properties: {
            ...feature.properties,
            color: color,
          },
        };
      });

      source.setData({
        type: 'FeatureCollection',
        features: updatedFeatures,
      });

      this.map?.setPaintProperty('distritos-fill', 'fill-color', [
        'match',
        ['get', 'color'],
        highlightColorMapping[40000],
        highlightColorMapping[40000],
        highlightColorMapping[50000],
        highlightColorMapping[50000],
        highlightColorMapping[60000],
        highlightColorMapping[60000],
        highlightColorMapping[80000],
        highlightColorMapping[80000],
        highlightColorMapping[100000],
        highlightColorMapping[100000],
        colorMapping[40000],
        colorMapping[40000],
        colorMapping[50000],
        colorMapping[50000],
        colorMapping[60000],
        colorMapping[60000],
        colorMapping[80000],
        colorMapping[80000],
        colorMapping[100000],
        colorMapping[100000],
        /* default */ '#ccc',
      ]);
    } else {
      console.error('La fuente de datos no está disponible o no es válida.');
    }
  }
}
