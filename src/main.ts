import { bootstrapApplication, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { provideRouter, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';


const routes: Routes = [
  // Define your routes here
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      CommonModule,
      BrowserAnimationsModule,
      MatInputModule,
      MatFormFieldModule,
      MatTableModule,
      MatChipsModule,
      MatDialogModule,
      MatIconModule,
      FormsModule,
      HttpClientModule,
      MatExpansionModule,
      
    ),
    
    provideRouter(routes), provideClientHydration(withEventReplay()),
  ]
}).catch(err => console.error(err));