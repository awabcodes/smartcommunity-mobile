import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Donation } from './donation.model';
import { DonationService } from './donation.service';
import { DonationRequest, DonationRequestService } from '../donation-request';
import { Account } from 'src/model/account.model';
import { AccountService } from 'src/app/services/auth/account.service';

@Component({
  selector: 'page-donation-update',
  templateUrl: 'donation-update.html',
})
export class DonationUpdatePage implements OnInit {
  donation: Donation;
  account: Account;
  donationRequest: DonationRequest;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    amount: [null, [Validators.required, Validators.min(1)]],
    receiptNumber: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private accountService: AccountService,
    private donationRequestService: DonationRequestService,
    private donationService: DonationService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.donationRequest = this.donationService.donationRequest;
    this.accountService.identity().then(
      (data) => (this.account = data),
      (error) => this.onError(error)
    );
  }

  save() {
    this.isSaving = true;
    const donation = this.createFromForm();

    this.subscribeToSaveResponse(this.donationService.create(donation));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Donation>>) {
    result.subscribe(
      (res: HttpResponse<Donation>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Donation ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();

    this.navController.navigateBack('/tabs/donation-request');
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

  private createFromForm(): Donation {
    return {
      ...new Donation(),
      id: this.form.get(['id']).value,
      amount: this.form.get(['amount']).value,
      receiptNumber: this.form.get(['receiptNumber']).value,
      userId: this.account.id,
      requestId: this.donationRequest.id,
    };
  }
}
