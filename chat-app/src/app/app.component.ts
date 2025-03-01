import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { HeaderComponent } from '@components/header/header.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { ChatComponent } from '@features/chat/chat.component';
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

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.userName = getUserName() || '';
    if (!this.userName) {
      this.openModal();
    } else {
      this.showModal = false;
    }
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
