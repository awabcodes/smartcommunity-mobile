import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Poll } from './poll.model';
import { PollService } from './poll.service';

@Component({
  selector: 'page-poll-update',
  templateUrl: 'poll-update.html',
})
export class PollUpdatePage implements OnInit {
  poll: Poll;
  creationDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    question: [null, [Validators.required]],
    active: ['false', [Validators.required]],
    createdBy: [null, [Validators.required]],
    creationDate: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private pollService: PollService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.poll = response.data;
      this.isNew = this.poll.id === null || this.poll.id === undefined;
      this.updateForm(this.poll);
    });
  }

  updateForm(poll: Poll) {
    this.form.patchValue({
      id: poll.id,
      question: poll.question,
      active: poll.active,
      createdBy: poll.createdBy,
      creationDate: this.isNew ? new Date().toISOString() : poll.creationDate,
    });
  }

  save() {
    this.isSaving = true;
    const poll = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.pollService.update(poll));
    } else {
      this.subscribeToSaveResponse(this.pollService.create(poll));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Poll>>) {
    result.subscribe(
      (res: HttpResponse<Poll>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Poll ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/poll');
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

  private createFromForm(): Poll {
    return {
      ...new Poll(),
      id: this.form.get(['id']).value,
      question: this.form.get(['question']).value,
      active: this.form.get(['active']).value,
      createdBy: this.form.get(['createdBy']).value,
      creationDate: new Date(this.form.get(['creationDate']).value),
    };
  }
}
