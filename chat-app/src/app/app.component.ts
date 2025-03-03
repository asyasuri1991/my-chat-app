import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';

import { HeaderComponent } from '@components/header/header.component';
import { MessageListComponent } from '@features/message-list/message-list.component';
import { ChatComponent } from '@features/chat/chat.component';
import { ChatService } from '@features/chat/services/chat.service';
import { getUserName, saveUserName } from '@features/user/models/user.storage';
import { UserModalComponent } from '@features/user/user-modal.component';
import { User } from '@features/user/models/user.model';


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
  broadcastChannel: BroadcastChannel;

  constructor(private dialog: MatDialog, private chatService: ChatService) {
    this.broadcastChannel = new BroadcastChannel('chat_channel');
  }

  ngOnInit(): void {
    const retrievedUserName = getUserName();
    if (typeof retrievedUserName === 'string') {
      this.userName = { name: retrievedUserName };
    } else {
      this.userName = { name: '' };
    }
    if (!this.userName.name) {
      this.openModal();
    } else {
      this.showModal = false;
    }
  }

  sendMessage(message: string): void {
    if (message.trim()) {
      this.chatService.sendMessage(this.userName.name, message);
    }
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
