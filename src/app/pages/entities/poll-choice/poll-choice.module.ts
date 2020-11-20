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

import { PollChoicePage } from './poll-choice';
import { PollChoiceUpdatePage } from './poll-choice-update';
import { PollChoice, PollChoiceService, PollChoiceDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PollChoiceResolve implements Resolve<PollChoice> {
  constructor(private service: PollChoiceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PollChoice> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PollChoice>) => response.ok),
        map((pollChoice: HttpResponse<PollChoice>) => pollChoice.body)
      );
    }
    return of(new PollChoice());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PollChoicePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PollChoiceUpdatePage,
    resolve: {
      data: PollChoiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PollChoiceDetailPage,
    resolve: {
      data: PollChoiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PollChoiceUpdatePage,
    resolve: {
      data: PollChoiceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PollChoicePage, PollChoiceUpdatePage, PollChoiceDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PollChoicePageModule {}
