import { Injectable } from '@angular/core';
import { RestService } from './rest-service.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BookDetails } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends RestService {
  protected restUrl(): string {
    return environment.apiUrl;
  }
  private readonly api = 'report';

  find(): Observable<BookDetails> {
    return this.getPaginatedRequest(this.api, []);
  }
}

