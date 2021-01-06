import { Component, OnInit } from '@angular/core';
import { DonationRequest } from './donation-request.model';
import { DonationRequestService } from './donation-request.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-donation-request-detail',
  templateUrl: 'donation-request-detail.html',
})
export class DonationRequestDetailPage implements OnInit {
  donationRequest: DonationRequest = {};

  constructor(
    private navController: NavController,
    private donationRequestService: DonationRequestService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.donationRequest = response.data;
    });
  }

  open(item: DonationRequest) {
    this.navController.navigateForward('/tabs/donation-request/' + item.id + '/edit');
  }

  async deleteModal(item: DonationRequest) {
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
            this.donationRequestService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/donation-request');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
