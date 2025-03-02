import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from '@features/user/model/user.model';

const USER_KEY = 'chat_user';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class HeaderComponent {
  @Input() user!: User;
  @Input() broadcastChannel!: BroadcastChannel;

  constructor(private dialog: MatDialog) {}

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