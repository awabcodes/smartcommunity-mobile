import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Donation } from './donation.model';
import { DonationRequest } from '../donation-request';

@Injectable({ providedIn: 'root' })
export class DonationService {
  donationRequest: DonationRequest

  private resourceUrl = ApiService.API_URL + '/donations';

  constructor(protected http: HttpClient) { }

  create(donation: Donation): Observable<HttpResponse<Donation>> {
    return this.http.post<Donation>(this.resourceUrl, donation, { observe: 'response' });
  }

  update(donation: Donation): Observable<HttpResponse<Donation>> {
    return this.http.put(this.resourceUrl, donation, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Donation>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Donation[]>> {
    const options = createRequestOption(req);
    return this.http.get<Donation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
