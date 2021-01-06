import { Component, OnInit } from '@angular/core';
import { Poll } from './poll.model';
import { PollService } from './poll.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-poll-detail',
  templateUrl: 'poll-detail.html',
})
export class PollDetailPage implements OnInit {
  poll: Poll = {};

  constructor(
    private navController: NavController,
    private pollService: PollService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.poll = response.data;
    });
  }

  open(item: Poll) {
    this.navController.navigateForward('/tabs/entities/poll/' + item.id + '/edit');
  }

  async deleteModal(item: Poll) {
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
            this.pollService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/poll');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
