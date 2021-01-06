import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { NeedOrder } from './need-order.model';
import { NeedOrderService } from './need-order.service';

@Component({
  selector: 'page-need-order',
  templateUrl: 'need-order.html',
})
export class NeedOrderPage {
  needOrders: NeedOrder[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private needOrderService: NeedOrderService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.needOrders = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.needOrderService
      .query()
      .pipe(
        filter((res: HttpResponse<NeedOrder[]>) => res.ok),
        map((res: HttpResponse<NeedOrder[]>) => res.body)
      )
      .subscribe(
        (response: NeedOrder[]) => {
          this.needOrders = response;
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

  trackId(index: number, item: NeedOrder) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/need-order/new');
  }

  edit(item: IonItemSliding, needOrder: NeedOrder) {
    this.navController.navigateForward('/tabs/need-order/' + needOrder.id + '/edit');
    item.close();
  }

  async delete(needOrder) {
    this.needOrderService.delete(needOrder.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'NeedOrder deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(needOrder: NeedOrder) {
    this.navController.navigateForward('/tabs/need-order/' + needOrder.id + '/view');
  }
}
