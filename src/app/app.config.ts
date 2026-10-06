import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import {
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import {
  provideHttpClient,
  withFetch
} from '@angular/common/http';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),

    provideClientHydration(withEventReplay()),

    // ✅ CORRECTION ICI
    provideHttpClient(withFetch()),

    provideFirebaseApp(() =>
      initializeApp({
        // 🔐 Firebase config ici
      })
    ),

    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
