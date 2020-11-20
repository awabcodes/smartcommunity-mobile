import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Vote } from './vote.model';
import { VoteService } from './vote.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { PollChoice, PollChoiceService } from '../poll-choice';

@Component({
  selector: 'page-vote-update',
  templateUrl: 'vote-update.html',
})
export class VoteUpdatePage implements OnInit {
  vote: Vote;
  users: User[];
  pollChoices: PollChoice[];
  creationDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    creationDate: [null, [Validators.required]],
    userId: [null, [Validators.required]],
    choiceId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private pollChoiceService: PollChoiceService,
    private voteService: VoteService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      (data) => (this.users = data),
      (error) => this.onError(error)
    );
    this.pollChoiceService.query().subscribe(
      (data) => {
        this.pollChoices = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.vote = response.data;
      this.isNew = this.vote.id === null || this.vote.id === undefined;
      this.updateForm(this.vote);
    });
  }

  updateForm(vote: Vote) {
    this.form.patchValue({
      id: vote.id,
      creationDate: this.isNew ? new Date().toISOString() : vote.creationDate,
      userId: vote.userId,
      choiceId: vote.choiceId,
    });
  }

  save() {
    this.isSaving = true;
    const vote = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.voteService.update(vote));
    } else {
      this.subscribeToSaveResponse(this.voteService.create(vote));
    }
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
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Vote ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/vote');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    toast.present();
  }

  private createFromForm(): Vote {
    return {
      ...new Vote(),
      id: this.form.get(['id']).value,
      creationDate: new Date(this.form.get(['creationDate']).value),
      userId: this.form.get(['userId']).value,
      choiceId: this.form.get(['choiceId']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  comparePollChoice(first: PollChoice, second: PollChoice): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPollChoiceById(index: number, item: PollChoice) {
    return item.id;
  }
}
