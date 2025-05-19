import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import mapboxgl from 'mapbox-gl';
import { MapServiceService } from '../../services/map-service.service';

@Component({
  selector: 'app-itineraries',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './itineraries.component.html',
  styleUrls: ['./itineraries.component.css']
})
export class ItinerariesComponent implements AfterViewInit {
  @ViewChild('routeMap', { static: false }) routeMap!: ElementRef;

  private map!: mapboxgl.Map;
  private accessTokenMapbox: string = '';
  private routeLayerId = 'route-layer';

  startLocation: string = '';
  endLocation: string = '';

  originMarker: mapboxgl.Marker | null = null;
  destinationMarker: mapboxgl.Marker | null = null;

  distanciaKm: string = '';
  duracionMin: number = 0;

  constructor(private mapService: MapServiceService) {}

  ngOnInit() {
    this.accessTokenMapbox = this.mapService.accessTokenMapbox;
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    mapboxgl.accessToken = this.accessTokenMapbox;

    this.map = new mapboxgl.Map({
      container: this.routeMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-3.70379, 40.41678],
      zoom: 12
    });

    this.map.on('load', () => {
      console.log('🗺️ Mapa cargado correctamente');
    });
  }

  async calculateRoute(event: Event) {
    event.preventDefault();

    if (!this.startLocation || !this.endLocation) {
      alert("⚠️ Ingresa un origen y un destino.");
      return;
    }

    try {
      const [startRes, endRes] = await Promise.all([
        this.mapService.geocodePlace(this.startLocation).toPromise(),
        this.mapService.geocodePlace(this.endLocation).toPromise()
      ]);

      const startCoords = startRes.features?.[0]?.center;
      const endCoords = endRes.features?.[0]?.center;

      if (!startCoords || !endCoords) {
        alert("⚠️ No se encontraron coordenadas válidas.");
        return;
      }

      const start = `${startCoords[0]},${startCoords[1]}`;
      const end = `${endCoords[0]},${endCoords[1]}`;

      // Limpiar marcadores anteriores
      this.originMarker?.remove();
      this.destinationMarker?.remove();

      // Crear nuevos marcadores
      this.originMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(startCoords)
        .addTo(this.map);

      this.destinationMarker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(endCoords)
        .addTo(this.map);

      // Pedir la ruta
      this.mapService.getItinerary(start, end).subscribe({
        next: (data: any) => {
          if (!data.routes || data.routes.length === 0) {
            alert("⚠️ No se encontró una ruta válida.");
            return;
          }

          const route = data.routes[0].geometry;
          this.drawRoute(route);

          // Extraer duración y distancia
          this.distanciaKm = (data.routes[0].distance / 1000).toFixed(2);
          this.duracionMin = Math.round(data.routes[0].duration / 60);
        },
        error: err => {
          alert("⚠️ Error al calcular la ruta.");
          console.error(err);
        }
      });

    } catch (error) {
      console.error("Error al convertir lugares a coordenadas:", error);
      alert("⚠️ Fallo al obtener coordenadas del origen o destino.");
    }
  }

  drawRoute(route: any) {
    if (this.map.getLayer(this.routeLayerId)) {
      this.map.removeLayer(this.routeLayerId);
      this.map.removeSource(this.routeLayerId);
    }

    this.map.addSource(this.routeLayerId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: route
      }
    });

    this.map.addLayer({
      id: this.routeLayerId,
      type: 'line',
      source: this.routeLayerId,
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#ff0000', 'line-width': 5 }
    });

    console.log("🧭 Ruta dibujada en el mapa.");
  }

  updateStartLocation(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.startLocation = inputElement.value;
  }
  
  updateEndLocation(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.endLocation = inputElement.value;
  }
  
  saveItinerary() {
    const itineraries = JSON.parse(localStorage.getItem('itineraries') || '[]');
  
    const nuevoItinerario = {
      origen: this.startLocation,
      destino: this.endLocation,
      distancia: this.distanciaKm,
      duracion: this.duracionMin,
      fecha: new Date().toLocaleString()
    };
  
    itineraries.push(nuevoItinerario);
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
  
    alert("📝 Itinerario guardado correctamente.");
  }
  
}
