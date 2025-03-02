import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from '@components/header/header.component';
import { MessageListComponent } from '@features/message-list/message-list.component';
import { ChatComponent } from '@features/chat/chat.component';
import { ChatService } from '@features/chat/services/chat.service';
import { getUserName, saveUserName } from '@features/user/model/user.storage';
import { UserModalComponent } from '@features/user/ui/user-modal/user-modal.component';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@features/user/model/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    CommonModule,
    HeaderComponent,
    MessageListComponent,
    ChatComponent,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class AppComponent implements OnInit {
  userName: User = { name: '' };
  showModal: boolean = true;
  processedMessages = new Set<string>();
  public broadcastChannel = new BroadcastChannel('chat_channel');

  constructor(private dialog: MatDialog, private chatService: ChatService) {}

  ngOnInit(): void {
    const retrievedUserName = getUserName();
    if (typeof retrievedUserName === 'string') {
      this.userName = { name: retrievedUserName };
    } else {
      this.userName = { name: '' };
    }
    
    console.log('Полученное userName:', this.userName.name);
    if (!this.userName.name) {
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
    const data = { id: messageId, userName: this.userName.name, message };
    this.broadcastChannel.postMessage(data);
    this.chatService.addMessage(this.userName.name, message);
  }

  openModal(): void {
    const dialogRef = this.dialog.open(UserModalComponent, {
      width: '400px',
      data: { userName: this.userName.name },
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result) {
        this.handleSaveUserName(result);
      }
    });
  }

  handleSaveUserName(userName: string): void {
    this.userName = { name: userName.trim() };
    saveUserName(this.userName.name);
    this.showModal = false;
    this.chatService.clearMessages();
  }

  handleCloseModal(): void {
    this.showModal = false;
  }
}
