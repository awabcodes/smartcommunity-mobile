import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Donation } from './donation.model';
import { DonationService } from './donation.service';

@Component({
  selector: 'page-donation',
  templateUrl: 'donation.html',
})
export class DonationPage {
  donations: Donation[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private donationService: DonationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.donations = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.donationService
      .query({ size: 999999, sort: ['id,desc'] })
      .pipe(
        filter((res: HttpResponse<Donation[]>) => res.ok),
        map((res: HttpResponse<Donation[]>) => res.body)
      )
      .subscribe(
        (response: Donation[]) => {
          this.donations = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: Donation) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/donation/new');
  }

  edit(item: IonItemSliding, donation: Donation) {
    this.navController.navigateForward('/tabs/donation/' + donation.id + '/edit');
    item.close();
  }

  async delete(donation) {
    this.donationService.delete(donation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Donation deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(donation: Donation) {
    this.navController.navigateForward('/tabs/donation/' + donation.id + '/view');
  }
}
