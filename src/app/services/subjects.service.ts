import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestService } from './rest-service.service';
import { Metadata, Subject } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService extends RestService {
  protected restUrl(): string {
    return environment.apiUrl;
  }
  private readonly api = 'subjects';

  find(metadata: Metadata): Observable<Metadata> {
    let params = this.getParams(metadata);
    //parametros custom:
    //params = params.append('custom.OnlyActives', String(metadata.custom.OnlyActives));
    console.log(params);
    return this.getPaginatedRequest(this.api, params);
  }

  override delete(id: string): Observable<Subject> {
    return this.deleteRequest(this.api, id);
  }

  override save(obj: Subject): Observable<Subject> {
    return this.postRequest(this.api, { description: obj.description });
  }

  override update(id : string, obj: Subject): Observable<Subject> {
    return this.putRequest(`${this.api}/${id}`, obj);
  }

  checkSubjectBooks(subjectId: string): Observable<Metadata> {
    let params = new URLSearchParams();
    return this.getPaginatedRequest(`${this.api}/${subjectId}/books`, params);
  }
}
