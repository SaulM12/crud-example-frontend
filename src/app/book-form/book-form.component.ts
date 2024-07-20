import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BookService } from '../services/book.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    InputNumberModule,
    CardModule
  ],
  templateUrl: './book-form.component.html',
  styleUrl: './book-form.component.scss',
})
export class BookFormComponent {
  formBook!: FormGroup;
  isSaveInProgress: boolean = false;
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private router:Router
  ) {
    this.formBook = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      author: ['', Validators.required],
      pages: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id !== 'new') {
      this.edit = true;
      this.getBookById(+id!)
    }
  }

  getBookById(id: number) {
    this.bookService.getBookById(id).subscribe({
      next: (foundBook) => {
        this.formBook.patchValue(foundBook);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No encontrado',
        });
        this.router.navigateByUrl('/')
      },
    });
  }

  createBook(){
    if (this.formBook.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return
    }
    this.isSaveInProgress=true
    this.bookService.createBook(this.formBook.value).subscribe({
      next:()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Libro guardado correctamente',
        });
        this.isSaveInProgress=false
        this.router.navigateByUrl('/')
      },
      error:()=>{
        this.isSaveInProgress=false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los campos e intente nuevamente',
        });
      }
    })
  }

  updateBook(){
    if (this.formBook.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Revise los campos e intente nuevamente',
      });
      return
    }
    this.isSaveInProgress=true
    this.bookService.updateBook(this.formBook.value).subscribe({
      next:()=>{
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Libro actualizado correctamente',
        });
        this.isSaveInProgress=false
        this.router.navigateByUrl('/')
      },
      error:()=>{
        this.isSaveInProgress=false
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise los campos e intente nuevamente',
        });
      }
    })
  }
}
