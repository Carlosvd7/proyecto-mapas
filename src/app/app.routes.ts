import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { SearchComponent } from './components/search/search.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { ItinerariesComponent } from './components/itineraries/itineraries.component';

export const routes: Routes = [
  { path: '', component: MapComponent },
  { path: 'search', component: SearchComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'itineraries', component: ItinerariesComponent }
];
