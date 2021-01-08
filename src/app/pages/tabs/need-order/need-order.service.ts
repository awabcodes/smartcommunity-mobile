import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { NeedOrder } from './need-order.model';
import { Need } from '../need/need.model';

@Injectable({ providedIn: 'root' })
export class NeedOrderService {
  private resourceUrl = ApiService.API_URL + '/need-orders';

  need: Need;

  constructor(protected http: HttpClient) {}

  create(needOrder: NeedOrder): Observable<HttpResponse<NeedOrder>> {
    return this.http.post<NeedOrder>(this.resourceUrl, needOrder, { observe: 'response' });
  }

  update(needOrder: NeedOrder): Observable<HttpResponse<NeedOrder>> {
    return this.http.put(this.resourceUrl, needOrder, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<NeedOrder>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<NeedOrder[]>> {
    const options = createRequestOption(req);
    return this.http.get<NeedOrder[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
