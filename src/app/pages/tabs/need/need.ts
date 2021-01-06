import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { Need } from './need.model';
import { NeedService } from './need.service';

@Component({
  selector: 'page-need',
  templateUrl: 'need.html',
})
export class NeedPage {
  needs: Need[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private needService: NeedService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.needs = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.needService
      .query()
      .pipe(
        filter((res: HttpResponse<Need[]>) => res.ok),
        map((res: HttpResponse<Need[]>) => res.body)
      )
      .subscribe(
        (response: Need[]) => {
          this.needs = response;
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

  trackId(index: number, item: Need) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/entities/need/new');
  }

  edit(item: IonItemSliding, need: Need) {
    this.navController.navigateForward('/tabs/entities/need/' + need.id + '/edit');
    item.close();
  }

  async delete(need) {
    this.needService.delete(need.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Need deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(need: Need) {
    this.navController.navigateForward('/tabs/entities/need/' + need.id + '/view');
  }
}
