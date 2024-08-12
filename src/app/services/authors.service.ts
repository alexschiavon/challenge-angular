import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Add this line
import { Author, Metadata } from '../models/models';
import { RestService } from './rest-service.service';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthorsService extends RestService {
  private readonly api = 'authors';
  protected restUrl(): string {
    return environment.apiUrl;
  }

  find(metadata: Metadata): Observable<Metadata> {
    let params = this.getParams(metadata);
    //parametros custom:
    //params = params.append('custom.OnlyActives', String(metadata.custom.OnlyActives));
    console.log(params);
    return this.getPaginatedRequest(this.api, params);
  }

  override delete(id: string): Observable<Author> {
    return this.deleteRequest(this.api, id);
  }

  override save(obj: Author): Observable<Author> {
    return this.postRequest(this.api, { name: obj.name });
  }

  override update(id : string, obj: Author): Observable<Author> {
    return this.putRequest(`${this.api}/${id}`, obj);
  }

  checkAuthorBooks(authorId: string): Observable<Metadata> {
    let params = new URLSearchParams();
    return this.getPaginatedRequest(`${this.api}/${authorId}/books`, params);
  }
}
