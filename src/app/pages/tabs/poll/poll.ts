import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Poll } from './poll.model';
import { PollService } from './poll.service';

@Component({
  selector: 'page-poll',
  templateUrl: 'poll.html',
})
export class PollPage {
  polls: Poll[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private pollService: PollService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.polls = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.pollService
      .query({ size: 999999, sort: ['id,desc'] })
      .pipe(
        filter((res: HttpResponse<Poll[]>) => res.ok),
        map((res: HttpResponse<Poll[]>) => res.body)
      )
      .subscribe(
        (response: Poll[]) => {
          this.polls = response;
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

  trackId(index: number, item: Poll) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/poll/new');
  }

  edit(item: IonItemSliding, poll: Poll) {
    this.navController.navigateForward('/tabs/poll/' + poll.id + '/edit');
    item.close();
  }

  async delete(poll) {
    this.pollService.delete(poll.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Poll deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(poll: Poll) {
    this.navController.navigateForward('/tabs/poll/' + poll.id + '/view');
  }
}
