import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RestService } from './rest-service.service';
import { Metadata, PurchaseType } from '../models/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PurchaseTypesService extends RestService {
  protected restUrl(): string {
    return environment.apiUrl;
  }
  private readonly api = 'purchase-types';

  find(metadata: Metadata): Observable<Metadata> {
    let params = this.getParams(metadata);
    //parametros custom:
    //params = params.append('custom.OnlyActives', String(metadata.custom.OnlyActives));
    console.log(params);
    return this.getPaginatedRequest(this.api, params);
  }

  override delete(id: string): Observable<PurchaseType> {
    return this.deleteRequest(this.api, id);
  }

  override save(obj: PurchaseType): Observable<PurchaseType> {
    return this.postRequest(this.api, { description: obj.name });
  }

  override update(id : string, obj: PurchaseType): Observable<PurchaseType> {
    return this.putRequest(`${this.api}/${id}`, obj);
  }
}

