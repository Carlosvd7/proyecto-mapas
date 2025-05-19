import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { IntroComponent } from '../intro/intro.component';
import { MapServiceService } from '../../services/map-service.service';


@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports:[IntroComponent]
})
export class MapComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  private map!: mapboxgl.Map;

  constructor(private mapService: MapServiceService){

  }

  ngOnInit(){}

  ngAfterViewInit(): void {
    this.initMap();
  }

  /** 🔥 Inicializa el mapa con Mapbox */
  initMap(): void {
    if (!this.mapContainer) {
      console.error("❌ No se encontró el contenedor del mapa.");
      return;
    }

    mapboxgl.accessToken = this.mapService.accessTokenMapbox;

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement, // ✅ Usar `nativeElement`
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-3.70379, 40.41678], // 📍 Madrid por defecto
      zoom: 12
    });

    // 📍 Agregar un marcador inicial en Madrid
    new mapboxgl.Marker({ color: 'red' })
      .setLngLat([-3.70379, 40.41678])
      .addTo(this.map);
  }
}
