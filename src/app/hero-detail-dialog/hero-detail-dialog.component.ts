import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MarvelHeroe } from '../core/model/mavelHeroe.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-detail-dialog',
  templateUrl: './hero-detail-dialog.component.html',
  styleUrls: ['./hero-detail-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class HeroDetailDialogComponent {
  heroForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<HeroDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MarvelHeroe,
    private fb: FormBuilder
  ) {
    this.heroForm = this.fb.group({
      id: [data.id, Validators.required],
      nameLabel: [data.nameLabel, Validators.required],
      genderLabel: [data.genderLabel, Validators.required],
      citizenshipLabel: [data.citizenshipLabel, Validators.required],
      skillsLabel: [data.skillsLabel, Validators.required],
      occupationLabel: [data.occupationLabel, Validators.required],
      memberOfLabel: [data.memberOfLabel, Validators.required],
      creatorLabel: [data.creatorLabel, Validators.required]
    });
  }

  onSave() {
    if (this.heroForm.valid) {
      this.dialogRef.close(this.heroForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}