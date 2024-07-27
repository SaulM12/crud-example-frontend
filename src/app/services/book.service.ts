
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:8080/book';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  createBook(book: Book, image:File): Observable<Book> {
    const formData = new FormData()
    formData.append('book', new Blob([JSON.stringify(book)], { type: 'application/json' }));
    formData.append('file', image)

    return this.http.post<Book>(this.apiUrl, formData);
  }

  updateBook(book: Book) {
    return this.http.put(this.apiUrl, book);
  }

  deleteBook(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateBookImage(id: number, image:File): Observable<Book> {
    const formData = new FormData()
    formData.append('file', image)
    return this.http.put<Book>(`${this.apiUrl}/${id}/image`,formData);
  }

}
