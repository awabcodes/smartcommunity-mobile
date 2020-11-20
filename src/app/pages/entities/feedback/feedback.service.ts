import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Feedback } from './feedback.model';

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private resourceUrl = ApiService.API_URL + '/feedbacks';

  constructor(protected http: HttpClient) {}

  create(feedback: Feedback): Observable<HttpResponse<Feedback>> {
    return this.http.post<Feedback>(this.resourceUrl, feedback, { observe: 'response' });
  }

  update(feedback: Feedback): Observable<HttpResponse<Feedback>> {
    return this.http.put(this.resourceUrl, feedback, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Feedback>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Feedback[]>> {
    const options = createRequestOption(req);
    return this.http.get<Feedback[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
