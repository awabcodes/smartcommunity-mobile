import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { Need } from './need.model';
import { NeedService } from './need.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-need-detail',
  templateUrl: 'need-detail.html',
})
export class NeedDetailPage implements OnInit {
  need: Need = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private needService: NeedService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.need = response.data;
    });
  }

  open(item: Need) {
    this.navController.navigateForward('/tabs/entities/need/' + item.id + '/edit');
  }

  async deleteModal(item: Need) {
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
            this.needService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/need');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
