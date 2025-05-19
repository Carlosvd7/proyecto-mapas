import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; //Importa correctamente `routes`
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Usamos "routes" aquí
    provideZoneChangeDetection(),
    provideHttpClient()
  ]
};
