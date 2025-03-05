import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Message } from '@features/chat/models/message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>(this.getMessages());
  public messages$ = this.messagesSubject.asObservable();
  private broadcastChannel = new BroadcastChannel('chat_channel');

  constructor() {
    this.setupBroadcastListener();
    this.initMessages();
  }

  sendMessage(author: string, text: string): void {
    const message: Message = {
      id: uuidv4(),
      author,
      text,
      date: new Date(),
    };
    const updatedMessages = [...this.getMessages(), message];
    localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
    this.broadcastChannel.postMessage(message);
    this.messagesSubject.next(updatedMessages);
  }

  getMessages(): Message[] {
    return JSON.parse(localStorage.getItem('chat_messages') || '[]');
  }

  private setupBroadcastListener(): void {
    this.broadcastChannel.onmessage = (event) => {
      const message = event.data as Message;
      const currentMessages = this.getMessages();
      if (!currentMessages.some((m) => m.id === message.id)) {
        const updatedMessages = [...currentMessages, message];
        localStorage.setItem('chat_messages', JSON.stringify(updatedMessages));
        this.messagesSubject.next(updatedMessages);
      }
    };
  }

  private initMessages(): void {
    const currentMessages = this.getMessages();
    this.messagesSubject.next(currentMessages);
  }

  clearMessages(): void {
    localStorage.removeItem('chat_messages');
    this.messagesSubject.next([]);
  }
}
