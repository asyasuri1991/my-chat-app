import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactsModalComponent } from '@features/contacts-modal/contacts-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() userName: string = '';

  constructor(private dialog: MatDialog) {}

  openContactsModal(): void {
    this.dialog.open(ContactsModalComponent, {
      width: '600px',
    });
  }
}
