import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { MatIconModule } from '@angular/material/icon';
import { MarvelHeroe } from '../core/model/mavelHeroe.model';

@Component({
  selector: 'app-hero-detail-dialog',
  templateUrl: './hero-detail-dialog.component.html',
  styleUrls: ['./hero-detail-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule
  ]
})
export class HeroDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: MarvelHeroe) {}
}