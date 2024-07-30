import { Injectable } from '@angular/core';
import { RestService } from './rest-service.service';
import { environment } from 'src/environments/environment';
import { Book, Metadata } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService extends RestService {
  protected restUrl(): string {
    return environment.apiUrl;
  }
  private readonly api = 'books';

  find(metadata: Metadata): Observable<Metadata> {
    let params = this.getParams(metadata);
    //parametros custom:
    //params = params.append('custom.OnlyActives', String(metadata.custom.OnlyActives));
    console.log(params);
    return this.getPaginatedRequest(this.api, params);
  }

  override delete(id: string): Observable<Book> {
    return this.deleteRequest(this.api, id);
  }

  override save(obj: Book): Observable<Book> {
    const { bookId, bookAuthors, bookSubjects, bookPrices, ...genericBook } = obj;
    // Remover os campos de código dos objetos BookAuthor
  const sanitizedBookAuthors = bookAuthors.map(({ bookCodl, ...rest }) => rest);
  const sanitizedBookSubjects = bookSubjects.map(({ bookCodl, ...rest }) => rest);
  const sanitizedPrice = bookPrices.map(({ bookId, ...rest }) => rest);

  // Adicionar a lista modificada de bookAuthors ao objeto genericBook
  const bookToSave = { ...genericBook,
                      bookAuthors: sanitizedBookAuthors,
                      bookSubjects: sanitizedBookSubjects,
                      bookPrices: sanitizedPrice
                    };

    console.log(genericBook);
    return this.postRequest(this.api, bookToSave);
  }

  override update(id : string, obj: Book): Observable<Book> {
    const { bookPrices, ...genericBook } = obj;
    //const sanitizedPrice = bookPrices.map(({ bookPriceId, ...rest }) => rest);
    // const bookToSave = { ...genericBook,
    //   bookPrices: sanitizedPrice
    // };
    console.log(obj);
    return this.putRequest(`${this.api}/${id}`, obj);
  }
}
