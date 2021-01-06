import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Vote } from './vote.model';
import { VoteService } from './vote.service';

@Component({
  selector: 'page-vote',
  templateUrl: 'vote.html',
})
export class VotePage {
  votes: Vote[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private voteService: VoteService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.votes = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.voteService
      .query()
      .pipe(
        filter((res: HttpResponse<Vote[]>) => res.ok),
        map((res: HttpResponse<Vote[]>) => res.body)
      )
      .subscribe(
        (response: Vote[]) => {
          this.votes = response;
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

  trackId(index: number, item: Vote) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/vote/new');
  }

  edit(item: IonItemSliding, vote: Vote) {
    this.navController.navigateForward('/tabs/vote/' + vote.id + '/edit');
    item.close();
  }

  async delete(vote) {
    this.voteService.delete(vote.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Vote deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(vote: Vote) {
    this.navController.navigateForward('/tabs/vote/' + vote.id + '/view');
  }
}
