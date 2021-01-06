import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { Announcement } from './announcement.model';
import { AnnouncementService } from './announcement.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-announcement-detail',
  templateUrl: 'announcement-detail.html',
})
export class AnnouncementDetailPage implements OnInit {
  announcement: Announcement = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private announcementService: AnnouncementService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.announcement = response.data;
    });
  }

  open(item: Announcement) {
    this.navController.navigateForward('/tabs/entities/announcement/' + item.id + '/edit');
  }

  async deleteModal(item: Announcement) {
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
            this.announcementService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/announcement');
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
