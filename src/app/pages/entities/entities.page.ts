import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Announcement', component: 'AnnouncementPage', route: 'announcement' },
    { name: 'Need', component: 'NeedPage', route: 'need' },
    { name: 'NeedOrder', component: 'NeedOrderPage', route: 'need-order' },
    { name: 'Feedback', component: 'FeedbackPage', route: 'feedback' },
    { name: 'DonationRequest', component: 'DonationRequestPage', route: 'donation-request' },
    { name: 'Donation', component: 'DonationPage', route: 'donation' },
    { name: 'Poll', component: 'PollPage', route: 'poll' },
    { name: 'PollChoice', component: 'PollChoicePage', route: 'poll-choice' },
    { name: 'Vote', component: 'VotePage', route: 'vote' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
