import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Need } from './need.model';

@Injectable({ providedIn: 'root' })
export class NeedService {
  private resourceUrl = ApiService.API_URL + '/needs';

  constructor(protected http: HttpClient) {}

  create(need: Need): Observable<HttpResponse<Need>> {
    return this.http.post<Need>(this.resourceUrl, need, { observe: 'response' });
  }

  update(need: Need): Observable<HttpResponse<Need>> {
    return this.http.put(this.resourceUrl, need, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Need>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Need[]>> {
    const options = createRequestOption(req);
    return this.http.get<Need[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
