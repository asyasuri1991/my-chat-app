import { Component, Input } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ChatService } from '@features/chat/services/chat.service';
import { Message } from '@features/chat/models/message.model';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class SidebarComponent {
  @Input() userName: string = 'User';

  messages$: Observable<Message[]>;

  private searchTerm$ = new BehaviorSubject<string>('');

  filteredMessages$: Observable<Message[]>;

  constructor(private chatService: ChatService) {
    this.messages$ = this.chatService.messages$;

    this.filteredMessages$ = this.searchTerm$.pipe(
      map((term: string) => term.toLowerCase()),
      switchMap((term: string) =>
        this.messages$.pipe(
          map((messages: Message[]) =>
            messages.filter(
              (message: Message) => message.text.toLowerCase().includes(term)
            )
          )
        )
      )
    );
  }

  filterMessages(event: Event): void {
    const input = event.target as HTMLInputElement;
    const term = input?.value || '';
    this.searchTerm$.next(term);
  }
}
