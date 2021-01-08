import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { PollChoice } from './poll-choice.model';

@Injectable({ providedIn: 'root' })
export class PollChoiceService {
  private resourceUrl = ApiService.API_URL + '/poll-choices';

  constructor(protected http: HttpClient) { }

  create(pollChoice: PollChoice): Observable<HttpResponse<PollChoice>> {
    return this.http.post<PollChoice>(this.resourceUrl, pollChoice, { observe: 'response' });
  }

  update(pollChoice: PollChoice): Observable<HttpResponse<PollChoice>> {
    return this.http.put(this.resourceUrl, pollChoice, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<PollChoice>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPollChoices(id: number, req?: any): Observable<HttpResponse<PollChoice[]>> {
    const options = createRequestOption(req);
    return this.http.get<PollChoice[]>(this.resourceUrl + '/polls/' + id, { params: options, observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<PollChoice[]>> {
    const options = createRequestOption(req);
    return this.http.get<PollChoice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
