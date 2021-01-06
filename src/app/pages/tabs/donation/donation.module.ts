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

import { DonationPage } from './donation';
import { DonationUpdatePage } from './donation-update';
import { Donation, DonationService, DonationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class DonationResolve implements Resolve<Donation> {
  constructor(private service: DonationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Donation> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Donation>) => response.ok),
        map((donation: HttpResponse<Donation>) => donation.body)
      );
    }
    return of(new Donation());
  }
}

const routes: Routes = [
  {
    path: '',
    component: DonationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DonationUpdatePage,
    resolve: {
      data: DonationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DonationDetailPage,
    resolve: {
      data: DonationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DonationUpdatePage,
    resolve: {
      data: DonationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [DonationPage, DonationUpdatePage, DonationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class DonationPageModule {}
