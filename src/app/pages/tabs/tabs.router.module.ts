import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
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
      {
        path: '',
        redirectTo: '/tabs/announcement',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/announcement',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
