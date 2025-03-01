import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private broadcastChannel = new BroadcastChannel('chat_channel');
  private messagesSubject = new BehaviorSubject<Message[]>(this.getMessages());
  messages$ = this.messagesSubject.asObservable();

  constructor() {
    this.setupBroadcastListener();
  }

  addMessage(author: string, text: string): void {
    const message: Message = {
      author,
      text,
      timestamp: new Date(),
    };

    const currentMessages = this.getMessages();
    currentMessages.push(message);
    localStorage.setItem('chat_messages', JSON.stringify(currentMessages));
    this.messagesSubject.next(currentMessages);
    
    this.broadcastChannel.postMessage(message);
  }

  getMessages(): Message[] {
    return JSON.parse(localStorage.getItem('chat_messages') || '[]');
  }

  setupBroadcastListener(): void {
    this.broadcastChannel.onmessage = (event) => {
      const message = event.data as Message;
      const currentMessages = this.getMessages();
      currentMessages.push(message);
      localStorage.setItem('chat_messages', JSON.stringify(currentMessages));
      this.messagesSubject.next(currentMessages);
    };
  }

  clearMessages(): void {
    localStorage.removeItem('chat_messages');
  
    this.messagesSubject.next([]);
  }
}