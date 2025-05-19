import { Component, AfterViewInit,ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router'
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
  standalone: true,
  imports: [CommonModule,FormsModule]
  
})
export class FavoritesComponent implements OnInit {
  public favorites: any[] = [];

  ngOnInit(): void {
    this.loadFavorites();
  }

  /*Cargar favoritos desde localStorage */
  loadFavorites() {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      this.favorites = JSON.parse(storedFavorites);
    }
  }

  /*Eliminar un lugar de favoritos */
  removeFavorite(index: number) {
    this.favorites.splice(index, 1);
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  /*Mover el mapa al lugar seleccionado */
  goToLocation(favorite: any) {
    alert(`Ubicación seleccionada: ${favorite.name} (${favorite.coords[1]}, ${favorite.coords[0]})`);
    // Aquí puedes navegar o actualizar otro componente con la ubicación.
  }

  updateNote(index: number, newNote: string) {
    this.favorites[index].note = newNote;
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }
  
}
