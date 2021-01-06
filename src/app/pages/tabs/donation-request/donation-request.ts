import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { DonationRequest } from './donation-request.model';
import { DonationRequestService } from './donation-request.service';

@Component({
  selector: 'page-donation-request',
  templateUrl: 'donation-request.html',
})
export class DonationRequestPage {
  donationRequests: DonationRequest[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private donationRequestService: DonationRequestService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.donationRequests = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.donationRequestService
      .query()
      .pipe(
        filter((res: HttpResponse<DonationRequest[]>) => res.ok),
        map((res: HttpResponse<DonationRequest[]>) => res.body)
      )
      .subscribe(
        (response: DonationRequest[]) => {
          this.donationRequests = response;
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

  trackId(index: number, item: DonationRequest) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/donation-request/new');
  }

  edit(item: IonItemSliding, donationRequest: DonationRequest) {
    this.navController.navigateForward('/tabs/donation-request/' + donationRequest.id + '/edit');
    item.close();
  }

  async delete(donationRequest) {
    this.donationRequestService.delete(donationRequest.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'DonationRequest deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(donationRequest: DonationRequest) {
    this.navController.navigateForward('/tabs/donation-request/' + donationRequest.id + '/view');
  }
}
