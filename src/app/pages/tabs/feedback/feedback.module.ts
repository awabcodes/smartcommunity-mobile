import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { FeedbackPage } from './feedback';
import { FeedbackUpdatePage } from './feedback-update';
import { Feedback, FeedbackService, FeedbackDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FeedbackResolve implements Resolve<Feedback> {
  constructor(private service: FeedbackService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Feedback> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Feedback>) => response.ok),
        map((feedback: HttpResponse<Feedback>) => feedback.body)
      );
    }
    return of(new Feedback());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FeedbackPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FeedbackUpdatePage,
    resolve: {
      data: FeedbackResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FeedbackDetailPage,
    resolve: {
      data: FeedbackResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FeedbackUpdatePage,
    resolve: {
      data: FeedbackResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FeedbackPage, FeedbackUpdatePage, FeedbackDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class FeedbackPageModule {}
