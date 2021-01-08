import { Component, OnInit } from '@angular/core';
import { Poll } from './poll.model';
import { PollService } from './poll.service';
import { NavController, AlertController, ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PollChoice, PollChoiceService } from '../poll-choice';
import { Vote, VoteService } from '../vote';
import { AccountService } from 'src/app/services/auth/account.service';
import { Account } from 'src/model/account.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'page-poll-detail',
  templateUrl: 'poll-detail.html',
})
export class PollDetailPage implements OnInit {
  poll: Poll = {};
  pollChoices: PollChoice[];
  account: Account;
  pickedChoice: PollChoice;

  constructor(
    private navController: NavController,
    private pollService: PollService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private voteService: VoteService,
    private pollChoiceService: PollChoiceService,
    private accountService: AccountService,
    protected toastCtrl: ToastController,
  ) { }

  ngOnInit(): void {
    this.accountService.identity().then(account => this.account = account);

    this.activatedRoute.data.subscribe((response) => {
      this.poll = response.data;
      this.pollChoiceService.getPollChoices(this.poll.id, { size: 999999, sort: ['id,desc'] }).subscribe(response => this.pollChoices = response.body);
    });
  }

  open(item: Poll) {
    this.navController.navigateForward('/tabs/poll/' + item.id + '/edit');
  }

  async deleteModal(item: Poll) {
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
            this.pollService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/poll');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  choiceChanged(event: any) {
    this.pickedChoice = event.detail.value;
  }

  vote() {
    const vote = this.createFromForm();

    this.subscribeToSaveResponse(this.voteService.create(vote));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Vote>>) {
    result.subscribe(
      (res: HttpResponse<Vote>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    const toast = await this.toastCtrl.create({ message: `Vote ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/vote');
  }

  async onError(error) {
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
  }

  private createFromForm(): Vote {
    return {
      ...new Vote(),
      creationDate: new Date(),
      userId: this.account.id,
      choiceId: this.pickedChoice.id,
    };
  }
}
