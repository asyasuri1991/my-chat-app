import { CommonModule } from '@angular/common';
import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '@features/user/model/user.model';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent {
  userName: User = { name: '' };
  @Output() saveUserName = new EventEmitter<string>();
  @Output() closeModal = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userName: string }
  ) {}

  handleSave(): void {
    if (this.userName.name.trim()) {
      this.dialogRef.close(this.userName.name.trim());
    }
  }

  handleClose(): void {
    this.dialogRef.close();
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.userName.name.trim()) {
      this.handleSave();
    }
  }
}
