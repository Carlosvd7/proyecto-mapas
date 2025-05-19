import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({providedIn: 'root'})
export class MapServiceService {

  accessTokenMapbox: string = 'pk.eyJ1IjoiY2FybG9zc3ZkNyIsImEiOiJjbTd4MXM5bzcwMHdkMmlxc3E0MDIxc3RpIn0.jSoYkkZTO8i9O-pMQij-2w';  
  accessTokenHere: string = 'o4nvYdhnFu5AtKnGOPM7AO4FxKg08L2FmO6hluRbvkA';  

  constructor(public http: HttpClient) { }

  getPlaces(query:string) {
    return this.http.get(`https://discover.search.hereapi.com/v1/discover?at=40.4168,-3.7038&q=${query}&apiKey=${this.accessTokenHere}&limit=5`);
  }

  getItinerary(startLocation:string, endLocation:string) {
    return this.http.get(`https://api.mapbox.com/directions/v5/mapbox/driving/${startLocation};${endLocation}?geometries=geojson&access_token=${this.accessTokenMapbox}`);
  }

  geocodePlace(place: string) {
    return this.http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(place)}.json?access_token=${this.accessTokenMapbox}`);
  }
  
}
