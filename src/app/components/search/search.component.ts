import { Component, AfterViewInit, ElementRef, ViewChild, importProvidersFrom } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import mapboxgl from 'mapbox-gl';
import { FormBuilder,FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MapServiceService } from '../../services/map-service.service';
import { NgClass } from '@angular/common';



@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [CommonModule, RouterModule,ReactiveFormsModule,NgClass]
})
export class SearchComponent implements AfterViewInit {
  @ViewChild('searchBox') searchBox!: ElementRef;
  @ViewChild('searchResults') searchResults!: ElementRef;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  public showResult: boolean = false;
  searchForm: FormGroup;
  private map!: mapboxgl.Map;
  private marker!: mapboxgl.Marker;
  public selectedPlace: any = null; //Guarda el lugar seleccionado
  showToast = false;
  toastMessage = '';
  public buttonText = '⭐ Guardar a Favoritos';
  public buttonState = 'default';

  
  constructor(private formBuilder: FormBuilder,private mapService: MapServiceService){
    this.searchForm = this.formBuilder.group({
      place: ['']
    });
  }

  ngOnInit(){}

  ngAfterViewInit(): void {
    this.initMap();

    this.searchForm.get('place')?.valueChanges.subscribe((data:any) =>{
      this.setupSearch(data);
    });
  }

  //Inicializar el mapa con Mapbox 
  initMap(): void {
    mapboxgl.accessToken = this.mapService.accessTokenMapbox;

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-3.70379, 40.41678], //Madrid por defecto
      zoom: 12
    });

  }

  //Configurar el buscador
  setupSearch(data:string){
    const dataSearch = data.trim();
    if (dataSearch.length > 2) {
      this.searchPlaces(dataSearch);
      this.showResult = true;
    } else {
      this.showResult = false;
    }

  }

  //Buscar lugares con HERE Maps 
  searchPlaces(query: string) {

    this.mapService.getPlaces(query).subscribe({
      next: (data:any) => {
        let places = data.items.map((place: any) => ({
          name: place.title,
          coords: [place.position.lat, place.position.lng],
          type: place.categories?.[0]?.name || "Lugar"
        })
      );
        this.displayResults(places);
      }
    });
  }

  //Mostrar resultados en la lista 
  displayResults(places: any[]) {
    let  resultsContainer = this.searchResults.nativeElement;
    resultsContainer.innerHTML = "";
    places.forEach((place) => {
        const div = document.createElement("div");
        div.textContent = `${place.name} (${place.type})`;
        div.classList.add("search-result");

        div.addEventListener("click", () => {
            (this.searchBox.nativeElement as HTMLInputElement).value = place.name;
            resultsContainer.innerHTML = "";
            
            const [lat, lng] = place.coords;
            console.log("📍 Ubicación seleccionada:", { lat, lng });

            // Mover el mapa correctamente**
            this.moveMapToLocation(lng, lat);

            // Guardar el lugar seleccionado en la variable**
            this.selectedPlace = place;

            // Actualizar la información del lugar**
            this.updatePlaceInfo(place);

            // Mostrar botón de guardar favoritos
            const saveButton = document.getElementById("save-button");
            if (saveButton) saveButton.style.display = "block";
            this.showResult = false;
        });

        resultsContainer.appendChild(div);
    });
  }

  //Mover el mapa a la ubicación seleccionada
  moveMapToLocation(lng: number, lat: number) {
    if (this.map) {
      this.map.flyTo({
        center: [lng, lat],
        zoom: 17, // 🔹 Zoom ajustado para mejor visibilidad
        essential: true
      });

      //Actualizar la posición del marcador**
      new mapboxgl.Marker({ color: "red" }).setLngLat([lng, lat]).addTo(this.map);

    } else {
      console.error("Error: El mapa no está inicializado.");
    }
  }

  //Actualizar información del lugar debajo del mapa 
  updatePlaceInfo(place: any) {
    const placeName = document.getElementById("place-name")!;
    const placeCategory = document.getElementById("place-category")!;

    placeName.textContent = place.name || "Lugar sin nombre";
    placeCategory.textContent = `Categoría: ${place.type}`;
  }

  //Guardar lugar en favoritos (localStorage)
  saveToFavorites() {
    if (!this.selectedPlace) {
      console.warn("No hay lugar seleccionado para guardar.");
      return;
    }
  
    let favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  
    const alreadyExists = favorites.some((fav: any) => fav.name === this.selectedPlace.name);
  
    if (!alreadyExists) {
      favorites.push(this.selectedPlace);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      console.log("Guardado en favoritos:", this.selectedPlace);
  
      this.buttonText = '✅ Lugar añadido a favoritos';
      this.buttonState = 'success';
    } else {
      console.warn("Este lugar ya está en favoritos.");
      this.buttonText = '⚠ Ya está en favoritos';
      this.buttonState = 'error';
    }
  
    // 🔄 Reiniciar botón a estado inicial tras 2.5 segundos
    setTimeout(() => {
      this.buttonText = '⭐ Guardar a Favoritos';
      this.buttonState = 'default';
    }, 500);
  }
  
  
  
  // Método auxiliar para mostrar el toast
  showToastMessage() {
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }
  
  
}





