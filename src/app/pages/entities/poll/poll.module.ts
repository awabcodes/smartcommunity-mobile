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

import { PollPage } from './poll';
import { PollUpdatePage } from './poll-update';
import { Poll, PollService, PollDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PollResolve implements Resolve<Poll> {
  constructor(private service: PollService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Poll> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Poll>) => response.ok),
        map((poll: HttpResponse<Poll>) => poll.body)
      );
    }
    return of(new Poll());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PollPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PollUpdatePage,
    resolve: {
      data: PollResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PollDetailPage,
    resolve: {
      data: PollResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PollUpdatePage,
    resolve: {
      data: PollResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PollPage, PollUpdatePage, PollDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PollPageModule {}
