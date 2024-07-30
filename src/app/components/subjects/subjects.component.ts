import { Component } from '@angular/core';
import { Metadata, Pagination, SortedBy, Subject } from 'src/app/models/models';
import { SubjectsService } from 'src/app/services/subjects.service';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent {
  selectedSubject: Subject | null = null;
  newSubject: Subject = new Subject('', '');
  displayMsgDelete: boolean = false;
  displayForm: boolean = false;
  isEditing: boolean = false;
  metadata: Metadata = this.getDefaultMetadata();
  Subjects: any;
  displayErrorSave = false;
  constructor(private subjectsService: SubjectsService) {}

  private getDefaultMetadata(
    sortby: SortedBy = { field: 'description', order: 'ASC' }
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
    this.subjectsService.find(this.metadata).subscribe((data: Metadata) => {
      this.metadata = data;
      this.Subjects = data.content;
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

  editSubject(Subject: Subject): void {
    this.displayForm = true;
    this.isEditing = true;
    this.newSubject = Subject;
    this.displayErrorSave = false;
    console.log(Subject);
  }

  deleteSubject(Subject: Subject): void {
    this.displayMsgDelete = true;
    this.selectedSubject = Subject;
  }

  confirmDelete(): void {
    if (this.selectedSubject) {
      this.subjectsService
        .delete(this.selectedSubject.subjectId)
        .subscribe(() => {
          console.log('Deleting Subject:', this.selectedSubject);
          this.list();
          this.selectedSubject = null;
          this.displayMsgDelete = false;
        });
    }
  }

  cancelDelete(): void {
    this.displayMsgDelete = false;
  }

  displayAddNewSubject(): void {
    this.newSubject = new Subject('', '');
    this.displayForm = true;
    this.displayErrorSave = false;
  }

  addSubject(): void {
    if (this.validate(this.newSubject)) {
      if (!this.isEditing) {
        if (this.newSubject) {
          this.subjectsService.save(this.newSubject).subscribe(
            () => {
              console.log('Saving Subject:', this.newSubject);
              this.list();
              this.newSubject = new Subject('', '');
              this.displayForm = false;
              this.displayErrorSave = false;
            },
            (error) => {
              this.displayErrorSave = true;
              console.error('Error saving subject:', error);
              // Handle error here
            }
          );
        }
      } else {
        if (this.newSubject) {
          this.subjectsService
            .update(this.newSubject.subjectId, this.newSubject)
            .subscribe(
              () => {
                console.log('Updating Subject:', this.newSubject);
                this.list();
                this.newSubject = new Subject('', '');
                this.displayForm = false;
                this.isEditing = false;
                this.displayErrorSave = false;
              },
              (error) => {
                this.displayErrorSave = true;
                console.error('Error updating subject:', error);
                // Handle error here
              }
            );
        }
      }
    }
  }

  validate(reg: Subject): boolean {
    const errors: string[] = [];
    if (
      !reg.description ||
      reg.description.length < 3 ||
      reg.description.length > 40
    ) {
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
