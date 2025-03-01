import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from '@components/header/header.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { ChatComponent } from '@features/chat/chat.component';
import { ChatService } from '@features/chat/services/chat.service';
import { ContactsModalComponent } from '@features/contacts-modal/contacts-modal.component';
import { getUserName, saveUserName } from '@features/user/model/user.storage';
import { UserModalComponent } from '@features/user/ui/user-modal/user-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    ChatComponent,
    MatDialogModule,
  ],
})
export class AppComponent implements OnInit {
  userName: string = '';
  showModal: boolean = true;

  public broadcastChannel = new BroadcastChannel('chat_channel');

  constructor(private dialog: MatDialog, private chatService: ChatService) {}

  ngOnInit(): void {
    this.userName = getUserName() || '';
    if (!this.userName) {
      this.openModal();
    } else {
      this.showModal = false;
    }
    this.setupBroadcastListener();
  }

  setupBroadcastListener(): void {
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.userName && event.data.message) {
        this.syncMessage(event.data.userName, event.data.message);
      }
    };
  }

  syncMessage(userName: string, message: string): void {
    this.chatService.addMessage(userName, message);
    console.log(`Сообщение от ${userName}: ${message}`);
  }

  sendMessage(message: string): void {
    this.broadcastChannel.postMessage({ userName: this.userName, message });
    this.chatService.addMessage(this.userName, message);
  }

  openModal(): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '400px',
      data: { userName: this.userName },
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.handleSaveUserName(result);
      }
    });
  }

  handleSaveUserName(userName: string): void {
    this.userName = userName.trim();
    saveUserName(this.userName);
    this.showModal = false;
  }

  handleCloseModal(): void {
    this.showModal = false;
  }

  openContactsModal(): void {
    this.dialog.open(ContactsModalComponent);
  }
}