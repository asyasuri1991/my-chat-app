import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ContactsModalComponent } from '@features/contacts-modal/contacts-modal.component';

const USER_KEY = 'chat_user';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Input() userName: string = '';
  @Input() broadcastChannel!: BroadcastChannel;

  constructor(private dialog: MatDialog) {}

  openContactsModal(): void {
    this.dialog.open(ContactsModalComponent, {
      width: '600px',
    });
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(USER_KEY);
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      console.log('BroadcastChannel закрыт');
    }

    window.location.reload();
  }
}