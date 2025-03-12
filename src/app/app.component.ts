import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { MarvelHeroesService } from './core/services/marvel-heroes.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeroDetailDialogComponent } from './hero-detail-dialog/hero-detail-dialog.component';
import { MarvelHeroe } from './core/model/mavelHeroe.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule,
    FormsModule
  ]
})
export class AppComponent implements OnInit {
  title = 'celonis-test-angular';
  columnDefs: string[] = ['id', 'name', 'gender', 'citizenship', 'skill', 'occupation', 'member', 'creator'];
  dataSource: MatTableDataSource<MarvelHeroe>;
  filterValue: string = '';
  chipFilters: string[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('chipInput')
  chipInput!: ElementRef<HTMLInputElement>;

  constructor(private marvelHeroesService: MarvelHeroesService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<MarvelHeroe>([]);
  }

  ngOnInit() {
    this.marvelHeroesService.loadMockData().subscribe((data: MarvelHeroe[]) => {
      this.dataSource.data = data;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: MarvelHeroe) => {
      return this.chipFilters.length === 0 || this.chipFilters.includes(data.name) && data.name.toLowerCase().includes(this.filterValue);
    };
  }

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.chipFilters.push(value);
    }

    if (this.chipInput) {
      this.chipInput.nativeElement.value = '';
    }

    this.applyFilter();
  }

  removeChip(name: string): void {
    const index = this.chipFilters.indexOf(name);

    if (index >= 0) {
      this.chipFilters.splice(index, 1);
    }
    this.applyFilter();
  }

  openDialog(hero: MarvelHeroe): void {
    this.dialog.open(HeroDetailDialogComponent, {
      data: hero,
    });
  }
}