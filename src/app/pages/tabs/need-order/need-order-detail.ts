import { Component, OnInit } from '@angular/core';
import { NeedOrder } from './need-order.model';
import { NeedOrderService } from './need-order.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-need-order-detail',
  templateUrl: 'need-order-detail.html',
})
export class NeedOrderDetailPage implements OnInit {
  needOrder: NeedOrder = {};

  constructor(
    private navController: NavController,
    private needOrderService: NeedOrderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.needOrder = response.data;
    });
  }

  open(item: NeedOrder) {
    this.navController.navigateForward('/tabs/need-order/' + item.id + '/edit');
  }

  async deleteModal(item: NeedOrder) {
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
            this.needOrderService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/need-order');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
