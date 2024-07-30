import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AuthorsComponent } from './components/authors/authors.component'; // Import AuthorsComponent
import { SubjectsComponent } from './components/subjects/subjects.component';
import { Globals } from './globals';
import { FormsModule } from '@angular/forms';
import { BooksComponent } from './components/books/books.component';
import { NgxMaskDirective, provideEnvironmentNgxMask } from 'ngx-mask';
import { CustomCurrencyPipe } from './pipes/custom-currency.pipe';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt'
import { NgxCurrencyDirective } from 'ngx-currency';
import { ReportComponent } from './components/report/report.component';

registerLocaleData(localePtBr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthorsComponent,
    SubjectsComponent,
    BooksComponent,
    CustomCurrencyPipe,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxMaskDirective,
    NgxCurrencyDirective
  ],
  providers: [
    Globals, // Add Globals here
    provideEnvironmentNgxMask()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
