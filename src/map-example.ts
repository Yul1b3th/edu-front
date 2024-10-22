import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LngLat, Map, Marker } from 'mapbox-gl';
import { Position } from '../../interfaces/map.interfaces';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  imports: [CommonModule],
})
export class MapComponent implements AfterViewInit, OnInit {
  public zoom: number = 12;
  public currentLngLat: LngLat = new LngLat(2.15899, 41.38879);
  public map!: Map;
  public markers: Position[] = [];

  public mapService = inject(MapService);

  @ViewChild('map') divMap?: ElementRef;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (!this.divMap) throw 'HTML element not found';

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: this.zoom, // starting zoom
    });

    this.mapService.getPositions().subscribe((positions) => {
      this.markers = positions;

      for (let i = 0; i < this.markers.length; i++) {
        const coordinates: LngLat = new LngLat(
          this.markers[i].longitude,
          this.markers[i].latitude
        );
        const markerHtml = document.createElement('div');
        markerHtml.className = 'marker';
        markerHtml.innerHTML = this.markers[i].race_point;

        const marker = new Marker({
          element: markerHtml,
        })
          .setLngLat(coordinates)
          .addTo(this.map);
      }
    });
  }
}
