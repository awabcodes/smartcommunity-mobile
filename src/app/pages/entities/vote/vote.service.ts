import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Vote } from './vote.model';

@Injectable({ providedIn: 'root' })
export class VoteService {
  private resourceUrl = ApiService.API_URL + '/votes';

  constructor(protected http: HttpClient) {}

  create(vote: Vote): Observable<HttpResponse<Vote>> {
    return this.http.post<Vote>(this.resourceUrl, vote, { observe: 'response' });
  }

  update(vote: Vote): Observable<HttpResponse<Vote>> {
    return this.http.put(this.resourceUrl, vote, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Vote>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Vote[]>> {
    const options = createRequestOption(req);
    return this.http.get<Vote[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
