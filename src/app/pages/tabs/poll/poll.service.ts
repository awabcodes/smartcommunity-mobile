import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Poll } from './poll.model';

@Injectable({ providedIn: 'root' })
export class PollService {
  private resourceUrl = ApiService.API_URL + '/polls';

  constructor(protected http: HttpClient) {}

  create(poll: Poll): Observable<HttpResponse<Poll>> {
    return this.http.post<Poll>(this.resourceUrl, poll, { observe: 'response' });
  }

  update(poll: Poll): Observable<HttpResponse<Poll>> {
    return this.http.put(this.resourceUrl, poll, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Poll>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByVote(id: number): Observable<HttpResponse<Poll>> {
    return this.http.get(`${this.resourceUrl}/votes/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Poll[]>> {
    const options = createRequestOption(req);
    return this.http.get<Poll[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryForUser(req?: any): Observable<HttpResponse<Poll[]>> {
    const options = createRequestOption(req);
    return this.http.get<Poll[]>(this.resourceUrl + '/user', { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
