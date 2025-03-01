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
import { v4 as uuidv4 } from 'uuid';

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
  processedMessages = new Set<string>();
  public broadcastChannel = new BroadcastChannel('chat_channel');
  
  constructor(private dialog: MatDialog, private chatService: ChatService) {}

  ngOnInit(): void {
    this.userName = getUserName() || '';
    console.log('Полученное userName:', this.userName);
    if (!this.userName) {
      this.openModal();
    } else {
      this.showModal = false;
    }
    this.setupBroadcastListener();
  }

  setupBroadcastListener(): void {
    this.broadcastChannel.onmessage = (event) => {
      const data = event.data;
      if (!data.id || this.processedMessages.has(data.id)) {
        return;
      }
      this.processedMessages.add(data.id);
      if (data.userName && data.message) {
        this.syncMessage(data.userName, data.message);
      }
    };
  }

  syncMessage(userName: string, message: string): void {
    this.chatService.addMessage(userName, message);
    console.log(`Сообщение от ${userName}: ${message}`);
  }

  sendMessage(message: string): void {
    const messageId = uuidv4();
    const data = { id: messageId, userName: this.userName, message };
    this.broadcastChannel.postMessage(data);
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
    this.chatService.clearMessages();
  }

  handleCloseModal(): void {
    this.showModal = false;
  }

  openContactsModal(): void {
    this.dialog.open(ContactsModalComponent);
  }
}