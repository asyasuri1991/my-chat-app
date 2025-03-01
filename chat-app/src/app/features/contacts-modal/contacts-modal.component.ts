import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-contacts-modal',
  templateUrl: './contacts-modal.component.html',
  // styleUrls: ['./contacts-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
  ],
})
export class ContactsModalComponent implements OnInit {
  searchQuery: string = '';
  contacts: string[] = [];

  constructor(public dialogRef: MatDialogRef<ContactsModalComponent>) {}

  ngOnInit(): void {
    // Загрузка контактов из localStorage
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      this.contacts = JSON.parse(savedContacts);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  addContact(): void {
    const newContact = prompt('Введите имя нового контакта:');
    if (newContact) {
      this.contacts.push(newContact);
      this.saveContacts();
    }
  }

  saveContacts(): void {
    // Сохраняем контакты в localStorage
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  get filteredContacts() {
    return this.contacts.filter(contact =>
      contact.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
