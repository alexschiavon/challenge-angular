import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthorsComponent } from './components/authors/authors.component';
import { SubjectsComponent } from './components/subjects/subjects.component';
import { BooksComponent } from './components/books/books.component';
import { ReportComponent } from './components/report/report.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'autores', component: AuthorsComponent },
  { path: 'assuntos', component: SubjectsComponent },
  { path: 'livros', component: BooksComponent },
  { path: 'relatorio', component: ReportComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
