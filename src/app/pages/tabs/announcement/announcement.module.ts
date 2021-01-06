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

import { AnnouncementPage } from './announcement';
import { Announcement, AnnouncementService, AnnouncementDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AnnouncementResolve implements Resolve<Announcement> {
  constructor(private service: AnnouncementService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Announcement> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Announcement>) => response.ok),
        map((announcement: HttpResponse<Announcement>) => announcement.body)
      );
    }
    return of(new Announcement());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AnnouncementPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AnnouncementDetailPage,
    resolve: {
      data: AnnouncementResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AnnouncementPage, AnnouncementDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
  providers: [Camera],
})
export class AnnouncementPageModule { }
