import { Component, OnInit, ViewChild, signal } from '@angular/core';

import { MarvelHeroesService } from './core/services/marvel-heroes.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeroDetailDialogComponent } from './hero-detail-dialog/hero-detail-dialog.component';
import { MarvelHeroe } from './core/model/mavelHeroe.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { countBy } from 'lodash';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChangeDetectorRef } from '@angular/core';

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
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSortModule,
    MatExpansionModule,
    CommonModule,
    PieChartComponent,
    BarChartComponent,
  ]
})
export class AppComponent implements OnInit {
  title = 'celonis-test-angular';
  columnDefs: string[] = ['id', 'name', 'skillsLabel', 'genderLabel', 'member', 'creator'];
  dataSource: MatTableDataSource<MarvelHeroe>;
  filterValue: string = '';
  createHeroForm: FormGroup;
  editHeroForm!: FormGroup;
  editingHero: MarvelHeroe | null = null;
  columnChartsData: { [key: string]: { labels: string[], data: number[] } } = {};

  @ViewChild(MatSort)
  sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  constructor(private marvelHeroesService: MarvelHeroesService, public dialog: MatDialog,
      private fb: FormBuilder,private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<MarvelHeroe>([]);
    this.createHeroForm = this.fb.group({
      nameLabel: ['', Validators.required],
      genderLabel: ['',Validators.pattern(/\b(female|male)\b(?!\s)/)],
      citizenshipLabel: ['', Validators.required],
      skillsLabel: ['', Validators.required],
      occupationLabel: ['', Validators.required],
      memberOfLabel: ['', Validators.required],
      creatorLabel: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.dataSource.data = this.getData();
    if(!!this.dataSource.data.length){
      console.log('tiene datos')
    } else {
      this.marvelHeroesService.loadMockData().subscribe((data: MarvelHeroe[]) => {
        this.dataSource.data = data;
      });
      this.saveData();
    }
    this.updateColumnChartsData();
  }

  private saveData(): void {
    localStorage.setItem('Heroes', JSON.stringify(this.dataSource.data ));
    this.dataSource.data = this.getData();
  }

  private getData(): Array<MarvelHeroe>| [] {
    return JSON.parse(localStorage.getItem('Heroes') || '[]');
  }

  applyFilter() {
    this.dataSource.data = this.getData();
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.dataSource.data = this.dataSource.filteredData;
    this.updateColumnChartsData();
    this.cdr.detectChanges();
  }

  openDialog(hero: MarvelHeroe): void {
    const dialogRef = this.dialog.open(HeroDetailDialogComponent, {
      data: hero,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editHero(result.id, result);
      }
    });
  }

  createHero() {
    if (this.createHeroForm.valid) {
      const newHero: MarvelHeroe = {
        id: this.dataSource.data.length + 1,
        ...this.createHeroForm.value
      };
     
      this.dataSource.data = [newHero, ... this.dataSource.data]
      this.dataSource._updateChangeSubscription();
      this.createHeroForm.reset();
      this.saveData();
      this.updateColumnChartsData();
    }
  }
  editHero(id: number, updatedHero: MarvelHeroe) {
    const index = this.dataSource.data.findIndex(hero => hero.id === id);
    if (index !== -1) {
      this.dataSource.data[index] = updatedHero;
      this.saveData();
      this.updateColumnChartsData();
    }
    this.editingHero = null;
  }

  deleteHero(id: number) {
    this.dataSource.data = this.dataSource.data.filter(hero => hero.id !== id);
    this.saveData();
  }

  startEdit(hero: MarvelHeroe) {
    this.editingHero = hero;
    this.editHeroForm.patchValue(hero);
    this.openDialog(hero);
  }

  updateColumnChartsData() {

    this.columnDefs.forEach(column => {
      if (column === 'actions' || column === 'id') {
        this.columnChartsData[column] = { labels: [], data: [] };
        return;
      }

      const columnData = this.dataSource.data.map(hero => hero[column]);
      const counts = countBy(columnData);
      const labels = Object.keys(counts);
      const data = [...Object.values(counts).map(value => Number(value))];
      this.columnChartsData[column] = { labels: [], data: [] };
      this.columnChartsData[column] = { labels, data };
     
    });
  }

}