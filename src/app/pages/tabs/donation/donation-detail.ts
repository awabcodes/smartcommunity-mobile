import { Component, OnInit } from '@angular/core';
import { Donation } from './donation.model';
import { DonationService } from './donation.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-donation-detail',
  templateUrl: 'donation-detail.html',
})
export class DonationDetailPage implements OnInit {
  donation: Donation = {};

  constructor(
    private navController: NavController,
    private donationService: DonationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.donation = response.data;
    });
  }

  open(item: Donation) {
    this.navController.navigateForward('/tabs/entities/donation/' + item.id + '/edit');
  }

  async deleteModal(item: Donation) {
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
            this.donationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/donation');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
