import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { DonationRequestPage } from './donation-request';
import { DonationRequestUpdatePage } from './donation-request-update';
import { DonationRequest, DonationRequestService, DonationRequestDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class DonationRequestResolve implements Resolve<DonationRequest> {
  constructor(private service: DonationRequestService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<DonationRequest> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<DonationRequest>) => response.ok),
        map((donationRequest: HttpResponse<DonationRequest>) => donationRequest.body)
      );
    }
    return of(new DonationRequest());
  }
}

const routes: Routes = [
  {
    path: '',
    component: DonationRequestPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DonationRequestUpdatePage,
    resolve: {
      data: DonationRequestResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DonationRequestDetailPage,
    resolve: {
      data: DonationRequestResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DonationRequestUpdatePage,
    resolve: {
      data: DonationRequestResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [DonationRequestPage, DonationRequestUpdatePage, DonationRequestDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class DonationRequestPageModule {}
