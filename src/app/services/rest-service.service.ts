import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Metadata } from '../models/models';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root',
})
export abstract class RestService {
  constructor(protected http: HttpClient, protected globals: Globals) {}

  protected getParams(metadata: Metadata){
    let params = new HttpParams();
    // Adicione os parâmetros de paginação
    params = params.append('pagination.limit', String(metadata.pagination.limit));
    params = params.append('pagination.currentPage', String(metadata.pagination.currentPage));
    params = params.append('pagination.pageCount', String(metadata.pagination.pageCount));
    params = params.append('pagination.totalCount', String(metadata.pagination.totalCount));

    // Adicione os parâmetros sortedBy
    params = params.append('sortedBy.field', metadata.sortedBy.field);
    params = params.append('sortedBy.order', metadata.sortedBy.order);
    return params;
  }

  private getHeader() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    });
  }

  protected deleteRequest(endpoint: string, id: string): Observable<any> {
    return this.http.delete(`${this.restUrl()}/${endpoint}/${id}`);
  }

  protected getRequest(endpoint: string, id?: string): Observable<any> {
    return id == null
      ? this.findAllRequest(endpoint)
      : this.findOneRequest(endpoint, id);
  }

  protected getRequestResponseTypeText(endpoint: string): Observable<any> {
    return this.http.get(`${this.restUrl()}/${endpoint}`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response',
      responseType: 'text',
    });
  }

  protected getPaginatedRequest(
    endpoint: string,
    params: any
  ): Observable<any> {
    const options = {
      headers: this.getHeader(),
      params: new HttpParams(params),
    };
    return this.http.get<any>(`${this.restUrl()}/${endpoint}`, { params: params })
    .pipe(map((res: any) => res));
  }

  protected findOneRequest(endpoint: string, id: string): Observable<any> {
    return this.http.get(`${this.restUrl()}/${endpoint}/${id}`);
  }

  protected findAllRequest(endpoint: string): Observable<any[]> {
    const options = { headers: this.getHeader() };
    return this.http.get<any>(`${this.restUrl()}/${endpoint}`, options);
  }

  protected findAllWithParamsRequest(
    endpoint: string,
    params: any
  ): Observable<any[]> {
    return this.http
      .get<any>(`${this.restUrl()}/${endpoint}`, params)
      .pipe(map((res: any) => res));
  }

  protected postRequest(endpoint: string, params: any): Observable<any> {
    return this.http.post(`${this.restUrl()}/${endpoint}`, params);
  }

  protected putRequest(endpoint: string, params: any): Observable<any> {
    return this.http.put(`${this.restUrl()}/${endpoint}`, params);
  }

  public getById(id: string): Observable<any> {
    return this.getRequest(id);
  }

  public delete(id: string): Observable<any> {
    return this.deleteRequest('', id);
  }

  public save(obj: any): Observable<any> {
      return this.postRequest('', obj);
  }

  public update(id : string, obj: any): Observable<any> {
    return this.putRequest(`/${id}`, obj);
  }

  protected abstract restUrl(): string;
}
