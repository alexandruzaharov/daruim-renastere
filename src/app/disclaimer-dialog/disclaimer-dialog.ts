import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-disclaimer-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './disclaimer-dialog.html',
  styleUrl: './disclaimer-dialog.scss'
})
export class DisclaimerDialog {
  private dialogRef = inject(MatDialogRef<DisclaimerDialog>);

  public accept() {
    this.dialogRef.close(true);
  }
}
