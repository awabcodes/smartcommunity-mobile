import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { JhiDataUtils } from 'ng-jhipster';
import { Feedback } from './feedback.model';
import { FeedbackService } from './feedback.service';

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  feedbacks: Feedback[];

  // todo: add pagination

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private feedbackService: FeedbackService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.feedbacks = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.feedbackService
      .query({ size: 999999, sort: ['id,desc'] })
      .pipe(
        filter((res: HttpResponse<Feedback[]>) => res.ok),
        map((res: HttpResponse<Feedback[]>) => res.body)
      )
      .subscribe(
        (response: Feedback[]) => {
          this.feedbacks = response;
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

  trackId(index: number, item: Feedback) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  new() {
    this.navController.navigateForward('/tabs/feedback/new');
  }

  edit(item: IonItemSliding, feedback: Feedback) {
    this.navController.navigateForward('/tabs/feedback/' + feedback.id + '/edit');
    item.close();
  }

  async delete(feedback) {
    this.feedbackService.delete(feedback.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Feedback deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(feedback: Feedback) {
    this.navController.navigateForward('/tabs/feedback/' + feedback.id + '/view');
  }
}
