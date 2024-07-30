import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Author, Metadata, Pagination, SortedBy } from 'src/app/models/models';
import { AuthorsService } from 'src/app/services/authors.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss'],
})
export class AuthorsComponent {
  selectedAuthor: Author | null = null;
  newAuthor: Author = new Author('', '');
  displayMsgDelete: boolean = false;
  displayForm: boolean = false;
  isEditing: boolean = false;
  authors: Author[] = [];
  metadata: Metadata = this.getDefaultMetadata();
  displayErrorSave = false;
  @ViewChild('form', { static: false })
  public form!: NgForm;
  constructor(private authorService: AuthorsService) {}

  private getDefaultMetadata(
    sortby: SortedBy = { field: 'name', order: 'ASC' }
  ) {
    let pagination: Pagination = {
      limit: 10,
      currentPage: 0,
      pageCount: 0,
      totalCount: 0,
    };
    return new Metadata(pagination, sortby, [], {});
  }

  ngOnInit(): void {
    this.list();
  }

  private list() {
    this.authorService.find(this.metadata).subscribe((data: Metadata) => {
      console.log(data);
      this.metadata = data;
      this.authors = data.content;
      this.displayErrorSave = false;
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

  editAuthor(author: Author): void {
    this.displayForm = true;
    this.isEditing = true;
    this.newAuthor = author;
    this.displayErrorSave = false;
    console.log(author);
  }

  deleteAuthor(author: Author): void {
    this.displayMsgDelete = true;
    this.selectedAuthor = author;
  }

  confirmDelete(): void {
    if (this.selectedAuthor) {
      this.authorService.delete(this.selectedAuthor.authorId).subscribe(() => {
        console.log('Deleting author:', this.selectedAuthor);
        this.list();
        this.selectedAuthor = null;
        this.displayMsgDelete = false;
      });
    }
  }

  cancelDelete(): void {
    this.displayMsgDelete = false;
  }

  displayAddNewAuthor(): void {
    this.newAuthor = new Author('', '');
    this.displayForm = true;
    this.displayErrorSave = false;
  }

  addAuthor(): void {
    if (this.validate(this.newAuthor)) {
      if (!this.isEditing) {
        if (this.newAuthor) {
          this.authorService.save(this.newAuthor).subscribe(
            () => {
              console.log('Saving Subject:', this.newAuthor);
              this.list();
              this.newAuthor = new Author('', '');
              this.displayForm = false;
            },
            (error) => {
              this.displayErrorSave = true;
              console.error('Error saving author:', error);
            }
          );
        }
      } else {
        if (this.newAuthor) {
          this.authorService
            .update(this.newAuthor.authorId, this.newAuthor)
            .subscribe(
              () => {
                console.log('Updating Author:', this.newAuthor);
                this.list();
                this.newAuthor = new Author('', '');
                this.displayForm = false;
                this.isEditing = false;
              },
              (error) => {
                this.displayErrorSave = true;
                console.error('Error updating author:', error);
              }
            );
        }
      }
    } else {
      console.log('Error saving author:', this.newAuthor);
    }
  }

  validate(reg: Author): boolean {
    const errors: string[] = [];
    if (!reg.name || reg.name.length < 3 || reg.name.length > 40) {
      errors.push('Titulo precisa ter de 3 a 40 letras.');
    }

    if (errors.length > 0) {
      this.displayErrorSave = true;
      return false;
    }
    return true;
  }

  displayList(): boolean {
    return !(this.displayMsgDelete || this.displayForm);
  }

  cancelEditRegister(): void {
    this.displayForm = false;
    this.list();
  }
}
