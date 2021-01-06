import { Component, OnInit } from '@angular/core';
import { Vote } from './vote.model';
import { VoteService } from './vote.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-vote-detail',
  templateUrl: 'vote-detail.html',
})
export class VoteDetailPage implements OnInit {
  vote: Vote = {};

  constructor(
    private navController: NavController,
    private voteService: VoteService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.vote = response.data;
    });
  }

  open(item: Vote) {
    this.navController.navigateForward('/tabs/vote/' + item.id + '/edit');
  }

  async deleteModal(item: Vote) {
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
            this.voteService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/vote');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
