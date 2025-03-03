import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message } from './models/message.model';
import { ChatService } from './services/chat.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { User } from '@features/user/model/user.model';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
  ],
})
export class ChatComponent implements OnInit {
  @Input() userName: User = { name: 'User' };
  messageControl = new FormControl('');
  messages: Message[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  sendMessage(): void {
    const messageText = this.messageControl.value?.trim();
    if (messageText) {
      this.chatService.sendMessage(this.userName.name, messageText);
      this.messageControl.setValue('');
    }
  }
}
