import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Book } from '../models/book';
import { BookService } from '../services/book.service';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ButtonModule, CardModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  books: Book[] = [];
  isDeleteInProgress: boolean = false;
  constructor(
    private bookService: BookService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getAllBooks();
  }

  getAllBooks() {
    this.bookService.getBooks().subscribe((data) => {
      this.books = data;
    });
  }

  deleteBook(id: number) {
    this.isDeleteInProgress = true;
    this.bookService.deleteBook(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Libro eliminado',
        });
        this.isDeleteInProgress = false;
        this.getAllBooks();
      },
      error: () => {
        this.isDeleteInProgress = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el libro',
        });
      },
    });
  }
}
