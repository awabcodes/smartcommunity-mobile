import { Component, OnInit } from '@angular/core';
import { PollChoice } from './poll-choice.model';
import { PollChoiceService } from './poll-choice.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-poll-choice-detail',
  templateUrl: 'poll-choice-detail.html',
})
export class PollChoiceDetailPage implements OnInit {
  pollChoice: PollChoice = {};

  constructor(
    private navController: NavController,
    private pollChoiceService: PollChoiceService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.pollChoice = response.data;
    });
  }

  open(item: PollChoice) {
    this.navController.navigateForward('/tabs/entities/poll-choice/' + item.id + '/edit');
  }

  async deleteModal(item: PollChoice) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.pollChoiceService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/poll-choice');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
