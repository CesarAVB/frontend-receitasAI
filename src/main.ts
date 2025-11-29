// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MainContainerComponent } from './app/components/main-container/main-container';

bootstrapApplication(MainContainerComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
  ]
})
  .catch((err) => console.error(err));
