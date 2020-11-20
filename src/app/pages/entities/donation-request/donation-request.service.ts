import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { DonationRequest } from './donation-request.model';

@Injectable({ providedIn: 'root' })
export class DonationRequestService {
  private resourceUrl = ApiService.API_URL + '/donation-requests';

  constructor(protected http: HttpClient) {}

  create(donationRequest: DonationRequest): Observable<HttpResponse<DonationRequest>> {
    return this.http.post<DonationRequest>(this.resourceUrl, donationRequest, { observe: 'response' });
  }

  update(donationRequest: DonationRequest): Observable<HttpResponse<DonationRequest>> {
    return this.http.put(this.resourceUrl, donationRequest, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<DonationRequest>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<DonationRequest[]>> {
    const options = createRequestOption(req);
    return this.http.get<DonationRequest[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
