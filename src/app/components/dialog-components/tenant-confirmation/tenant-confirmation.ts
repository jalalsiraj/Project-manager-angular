import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tenant-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Enter Tenant ID</h2>

    <mat-dialog-content style="margin-top: 20px;">
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Tenant ID</mat-label>
        <input matInput [formControl]="tenantIdControl" />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button matButton (click)="onClose()">Close</button>
      <button matButton="elevated" color="accent" (click)="onProceedWithDefault()">Proceed with Default</button>
      <button  matButton="filled" (click)="onOkay()">Okay</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .w-full { width: 100%; }
  `]
})
export class TenantConfirmation {
  constructor(
    private dialogRef: MatDialogRef<TenantConfirmation>,
    @Inject(MAT_DIALOG_DATA) public data: { defaultTenantId: string }
  ) { }

  tenantIdControl = new FormControl('');

  onClose(): void {
    this.dialogRef.close(null);
  }

  onProceedWithDefault(): void {
    this.dialogRef.close(this.data.defaultTenantId);
  }

  onOkay(): void {
    this.dialogRef.close(this.tenantIdControl.value);
  }
}
