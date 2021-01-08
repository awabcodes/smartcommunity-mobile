import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PollChoice } from './poll-choice.model';
import { PollChoiceService } from './poll-choice.service';
import { Poll, PollService } from '../poll';

@Component({
  selector: 'page-poll-choice-update',
  templateUrl: 'poll-choice-update.html',
})
export class PollChoiceUpdatePage implements OnInit {
  pollChoice: PollChoice;
  polls: Poll[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    choice: [null, [Validators.required]],
    pollId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private pollService: PollService,
    private pollChoiceService: PollChoiceService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.pollService.query({ size: 999999, sort: ['id,desc'] }).subscribe(
      (data) => {
        this.polls = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.pollChoice = response.data;
      this.isNew = this.pollChoice.id === null || this.pollChoice.id === undefined;
      this.updateForm(this.pollChoice);
    });
  }

  updateForm(pollChoice: PollChoice) {
    this.form.patchValue({
      id: pollChoice.id,
      choice: pollChoice.choice,
      pollId: pollChoice.pollId,
    });
  }

  save() {
    this.isSaving = true;
    const pollChoice = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.pollChoiceService.update(pollChoice));
    } else {
      this.subscribeToSaveResponse(this.pollChoiceService.create(pollChoice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PollChoice>>) {
    result.subscribe(
      (res: HttpResponse<PollChoice>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `PollChoice ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/poll-choice');
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

  private createFromForm(): PollChoice {
    return {
      ...new PollChoice(),
      id: this.form.get(['id']).value,
      choice: this.form.get(['choice']).value,
      pollId: this.form.get(['pollId']).value,
    };
  }

  comparePoll(first: Poll, second: Poll): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPollById(index: number, item: Poll) {
    return item.id;
  }
}
