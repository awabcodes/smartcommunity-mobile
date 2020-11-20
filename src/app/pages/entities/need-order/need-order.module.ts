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

import { NeedOrderPage } from './need-order';
import { NeedOrderUpdatePage } from './need-order-update';
import { NeedOrder, NeedOrderService, NeedOrderDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class NeedOrderResolve implements Resolve<NeedOrder> {
  constructor(private service: NeedOrderService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<NeedOrder> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<NeedOrder>) => response.ok),
        map((needOrder: HttpResponse<NeedOrder>) => needOrder.body)
      );
    }
    return of(new NeedOrder());
  }
}

const routes: Routes = [
  {
    path: '',
    component: NeedOrderPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NeedOrderUpdatePage,
    resolve: {
      data: NeedOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NeedOrderDetailPage,
    resolve: {
      data: NeedOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NeedOrderUpdatePage,
    resolve: {
      data: NeedOrderResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [NeedOrderPage, NeedOrderUpdatePage, NeedOrderDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class NeedOrderPageModule {}
