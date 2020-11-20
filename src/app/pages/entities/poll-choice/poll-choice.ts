import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { PollChoice } from './poll-choice.model';
import { PollChoiceService } from './poll-choice.service';

@Component({
  selector: 'page-poll-choice',
  templateUrl: 'poll-choice.html',
})
export class PollChoicePage {
  pollChoices: PollChoice[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private pollChoiceService: PollChoiceService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.pollChoices = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.pollChoiceService
      .query()
      .pipe(
        filter((res: HttpResponse<PollChoice[]>) => res.ok),
        map((res: HttpResponse<PollChoice[]>) => res.body)
      )
      .subscribe(
        (response: PollChoice[]) => {
          this.pollChoices = response;
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

  trackId(index: number, item: PollChoice) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/poll-choice/new');
  }

  edit(item: IonItemSliding, pollChoice: PollChoice) {
    this.navController.navigateForward('/tabs/entities/poll-choice/' + pollChoice.id + '/edit');
    item.close();
  }

  async delete(pollChoice) {
    this.pollChoiceService.delete(pollChoice.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'PollChoice deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(pollChoice: PollChoice) {
    this.navController.navigateForward('/tabs/entities/poll-choice/' + pollChoice.id + '/view');
  }
}
