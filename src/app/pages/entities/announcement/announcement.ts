import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { Announcement } from './announcement.model';
import { AnnouncementService } from './announcement.service';

@Component({
  selector: 'page-announcement',
  templateUrl: 'announcement.html',
})
export class AnnouncementPage {
  announcements: Announcement[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private announcementService: AnnouncementService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.announcements = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.announcementService
      .query()
      .pipe(
        filter((res: HttpResponse<Announcement[]>) => res.ok),
        map((res: HttpResponse<Announcement[]>) => res.body)
      )
      .subscribe(
        (response: Announcement[]) => {
          this.announcements = response;
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

  trackId(index: number, item: Announcement) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/announcement/new');
  }

  edit(item: IonItemSliding, announcement: Announcement) {
    this.navController.navigateForward('/tabs/entities/announcement/' + announcement.id + '/edit');
    item.close();
  }

  async delete(announcement) {
    this.announcementService.delete(announcement.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Announcement deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(announcement: Announcement) {
    this.navController.navigateForward('/tabs/entities/announcement/' + announcement.id + '/view');
  }
}
