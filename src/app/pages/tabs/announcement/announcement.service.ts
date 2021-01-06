import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Announcement } from './announcement.model';

@Injectable({ providedIn: 'root' })
export class AnnouncementService {
  private resourceUrl = ApiService.API_URL + '/announcements';

  constructor(protected http: HttpClient) {}

  create(announcement: Announcement): Observable<HttpResponse<Announcement>> {
    return this.http.post<Announcement>(this.resourceUrl, announcement, { observe: 'response' });
  }

  update(announcement: Announcement): Observable<HttpResponse<Announcement>> {
    return this.http.put(this.resourceUrl, announcement, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Announcement>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Announcement[]>> {
    const options = createRequestOption(req);
    return this.http.get<Announcement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
