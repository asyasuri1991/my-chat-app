import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { ChatService } from '@features/chat/services/chat.service';
import { Message } from '@features/chat/models/message.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, MatListModule, MatCardModule],
})
export class SidebarComponent {
  messages$: Observable<Message[]>;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;
  }
}