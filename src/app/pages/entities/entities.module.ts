import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { EntitiesPage } from './entities.page';

const routes: Routes = [
  {
    path: '',
    component: EntitiesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'announcement',
    loadChildren: './announcement/announcement.module#AnnouncementPageModule',
  },
  {
    path: 'need',
    loadChildren: './need/need.module#NeedPageModule',
  },
  {
    path: 'need-order',
    loadChildren: './need-order/need-order.module#NeedOrderPageModule',
  },
  {
    path: 'feedback',
    loadChildren: './feedback/feedback.module#FeedbackPageModule',
  },
  {
    path: 'donation-request',
    loadChildren: './donation-request/donation-request.module#DonationRequestPageModule',
  },
  {
    path: 'donation',
    loadChildren: './donation/donation.module#DonationPageModule',
  },
  {
    path: 'poll',
    loadChildren: './poll/poll.module#PollPageModule',
  },
  {
    path: 'poll-choice',
    loadChildren: './poll-choice/poll-choice.module#PollChoicePageModule',
  },
  {
    path: 'vote',
    loadChildren: './vote/vote.module#VotePageModule',
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage],
})
export class EntitiesPageModule {}
