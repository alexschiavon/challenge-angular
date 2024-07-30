import { Component } from '@angular/core';
import { Author, Book, BookAuthor, BookPrice, BookSubject, Metadata, Pagination, PurchaseType, SortedBy, Subject } from 'src/app/models/models';
import { AuthorsService } from 'src/app/services/authors.service';
import { BooksService } from 'src/app/services/books.service';
import { PurchaseTypesService } from 'src/app/services/purchase-types.service';
import { SubjectsService } from 'src/app/services/subjects.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent {

  selectedBook: Book | null = null;
  newBook: Book = Book.empty();
  displayMsgDelete: boolean = false;
  displayForm: boolean = false;
  isEditing: boolean = false;
  metadata: Metadata = this.getDefaultMetadata();
  Books: any;
  Subjects: Subject[] = [];
  Authors: Author[] = [];
  purchaseTypes: PurchaseType[] = [];
  errorMessage: string = '';
  newPrice: BookPrice = new BookPrice("", '', 0);

  constructor(private booksService: BooksService,
              private subjectsService: SubjectsService,
              private authorsService: AuthorsService,
              private purchaseTypesService: PurchaseTypesService) {}

  private getDefaultMetadata(
    sortby: SortedBy = { field: 'title', order: 'ASC' }
  ) {
    let pagination: Pagination = {
      limit: 10,
      currentPage: 0,
      pageCount: 0,
      totalCount: 0,
    };
    return new Metadata(pagination, sortby, [], {});
  }

  private getAuxiliaryData() {
    var sortbySub: SortedBy = { field: 'description', order: 'ASC' }
    var sortbyAut: SortedBy = { field: 'name', order: 'ASC' }
    var meta = new Metadata();
    meta.pagination.limit = 1000;
    meta.pagination.currentPage = 0;
    meta.pagination.pageCount = 0;
    meta.pagination.totalCount = 0;
    meta.sortedBy = sortbySub;
    this.subjectsService.find(meta).subscribe((data: Metadata) => {
      console.log(data);
      this.Subjects = data.content;
    });
    meta.sortedBy = sortbyAut;
    this.authorsService.find(meta).subscribe((data: Metadata) => {
      console.log(data);
      this.Authors = data.content;
    });
    this.purchaseTypesService.find(meta).subscribe((data: Metadata) => {
      console.log(data);
      this.purchaseTypes = data.content;
    });
  }

  ngOnInit(): void {
    this.getAuxiliaryData();
    this.list();
  }

  private list() {
    this.booksService.find(this.metadata).subscribe((data: Metadata) => {
      this.metadata = data;
      this.Books = data.content;
    });
  }
  // Método para verificar se o botão "Previous" deve estar desabilitado
  isPreviousDisabled(): boolean {
    return this.metadata.pagination.currentPage === 0;
  }

  // Método para verificar se o botão "Next" deve estar desabilitado
  isNextDisabled(): boolean {
    return (
      this.metadata.pagination.currentPage >=
      this.metadata.pagination.pageCount - 1
    );
  }

  // Métodos para mudar de página
  goToPreviousPage(): void {
    if (!this.isPreviousDisabled()) {
      this.metadata.pagination.currentPage--;
      this.list();
    }
  }

  goToNextPage(): void {
    if (!this.isNextDisabled()) {
      this.metadata.pagination.currentPage++;
      this.list();
    }
  }

  editBook(Book: Book): void {
    this.displayForm = true;
    this.isEditing = true;
    this.newBook = Book;
    this.errorMessage = '';
    console.log(Book);
  }

  deleteBook(Book: Book): void {
    this.displayMsgDelete = true;
    this.selectedBook = Book;
  }

  confirmDelete(): void {
    if (this.selectedBook) {
      this.booksService
        .delete(this.selectedBook.bookId)
        .subscribe(() => {
          console.log('Deleting Book:', this.selectedBook);
          this.list();
          this.selectedBook = null;
          this.displayMsgDelete = false;
        });
    }
  }

  cancelDelete(): void {
    this.displayMsgDelete = false;
  }

  displayAddNewBook(): void {
    this.newBook = Book.empty();
    this.displayForm = true;
    this.errorMessage = '';
  }

  validateBook(book: Book): boolean {
    const errors: string[] = [];

    if (!book.title || book.title.length < 3 || book.title.length > 40) {
        errors.push('Titulo precisa ter de 3 a 40 letras.');
    }
    if (!book.publisher || book.publisher.length < 3 || book.publisher.length > 40) {
        errors.push('Editora precisa ter de 3 a 40 letras.');
    }
    if (!book.edition || book.edition <= 0) {
        errors.push('Edição precisa ser maior que 0.');
    }
    if (!book.publicationYear || book.publicationYear.length !== 4) {
        errors.push('Ano de publicação precisa ter 4 dígitos.');
    }
    if (!book.bookAuthors || book.bookAuthors.length === 0) {
        errors.push('Autor é obrigatório.');
    }
    if (!book.bookSubjects || book.bookSubjects.length === 0) {
        errors.push('Assunto é obrigatório.');
    }
    // if (!book.price || book.price <= 0) {
    //   errors.push('Price is required and must be greater than 0.');
    // }
    // Adicione outras validações conforme necessário

    if (errors.length > 0) {
        this.errorMessage = errors.join('<br>');
        return false;
    }

    this.errorMessage = '';
    return true;
}

  addBook(): void {
    console.log('Adding Book is editing:', this.isEditing);
    if (this.newBook && this.validateBook(this.newBook)) {
      if (!this.isEditing) {
        this.booksService.save(this.newBook).subscribe(() => {
          console.log('Saving Book:', this.newBook);
          this.list();
          this.newBook = Book.empty();
          this.displayForm = false;
        });
      } else {
        this.booksService.update(this.newBook.bookId, this.newBook).subscribe(() => {
          console.log('Updating Book:', this.newBook);
          this.list();
          this.newBook = Book.empty();
          this.displayForm = false;
        });
      }
      this.isEditing = false
    }
  }

  displayList(): boolean {
    return !(this.displayMsgDelete || this.displayForm);
  }

  cancelEditRegister(): void {
    this.displayForm = false;
    this.isEditing = false;
  }

  getAuthorName(book: Book): string {
    if (!book.bookAuthors || book.bookAuthors.length === 0) {
      return '';
    }

    return book.bookAuthors
      .map(bookAuthor => this.getAuthorById(bookAuthor.authorCodAu)?.name || '')
      .filter(name => name !== '')
      .join(', ');
  }

  getSubjectById(id: string): Subject | undefined {
    return this.Subjects.find(sub => sub.subjectId === id);
  }

  getSubjectName(book: Book): string {
    if (!book.bookSubjects || book.bookSubjects.length === 0) {
      return '';
    }

    return book.bookSubjects
      .map(bookSubject => this.getSubjectById(bookSubject.subjectCodAs)?.description || '')
      .filter(name => name !== '')
      .join(', ');
  }

  getAuthorById(authorId: string): Author | undefined {
    return this.Authors.find(author => author.authorId === authorId);
  }

  onSubjectChange(event: any) {
    const subjectId = event.target.value;
    const subject = this.Subjects.find(s => s.subjectId === subjectId);

    if (event.target.checked) {
      // Adiciona o assunto ao array se estiver marcado
      if (subject && !this.newBook.bookSubjects.some(s => s.subjectCodAs === subjectId)) {
        this.newBook.bookSubjects.push(new BookSubject(this.newBook.bookId, subjectId));
      }
    } else {
      // Remove o assunto do array se estiver desmarcado
      this.newBook.bookSubjects = this.newBook.bookSubjects.filter(s => s.subjectCodAs !== subjectId);
    }
  }

  isSubjectChecked(subjectId: string): boolean {
    return this.newBook.bookSubjects.some(s => s.subjectCodAs === subjectId);
  }


  onAuthorChange(event: any) {
    const selectedOptions = Array.from(event.target.selectedOptions).map((option: any) => option.value);
    console.log(selectedOptions);
    this.newBook.bookAuthors = selectedOptions.map(authorId => new BookAuthor(this.newBook.bookId, authorId));
    //this.newBook.bookAuthors = selectedOptions;
  }

  isAuthorSelected(authorId: string): boolean {
    return this.newBook.bookAuthors.some(author => author.authorCodAu === authorId);
  }

  existingPrice() : boolean{
    return this.newBook.bookPrices.find(p => p.purchaseTypeId === this.newPrice.purchaseTypeId) !== undefined;
  }

  addPrice() {
    const existingPrice = this.existingPrice();

    if (existingPrice) {
      console.log(`Preço já existe para esse modo de compra: ${this.getPurchaseTypeName(this.newPrice.purchaseTypeId)}`);
      return; // Não inserir o novo preço
    }
    const priceToAdd = { ...this.newPrice, bookPriceId: '', bookId: this.newBook.bookId };
    this.newBook.bookPrices.push(priceToAdd);
    this.newPrice = new BookPrice(this.newBook.bookId, '', 0);
  }

  removePrice(index: number) {
    this.newBook.bookPrices.splice(index, 1);
  }

  getPurchaseTypeName(purchaseTypeId: string): string {
    const type = this.purchaseTypes.find(pt => pt.purchaseTypeId === purchaseTypeId);
    return type ? type.name : 'Desconhecido';
  }

}
