import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DonationRequest } from './donation-request.model';
import { DonationRequestService } from './donation-request.service';

@Component({
  selector: 'page-donation-request-update',
  templateUrl: 'donation-request-update.html',
})
export class DonationRequestUpdatePage implements OnInit {
  donationRequest: DonationRequest;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    cause: [null, [Validators.required]],
    paymentInfo: [null, [Validators.required]],
    info: [null, [Validators.required]],
    totalAmount: [null, [Validators.required]],
    contact: [null, [Validators.required]],
    amountRaised: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private donationRequestService: DonationRequestService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((response) => {
      this.donationRequest = response.data;
      this.isNew = this.donationRequest.id === null || this.donationRequest.id === undefined;
      this.updateForm(this.donationRequest);
    });
  }

  updateForm(donationRequest: DonationRequest) {
    this.form.patchValue({
      id: donationRequest.id,
      cause: donationRequest.cause,
      paymentInfo: donationRequest.paymentInfo,
      info: donationRequest.info,
      totalAmount: donationRequest.totalAmount,
      contact: donationRequest.contact,
      amountRaised: donationRequest.amountRaised,
    });
  }

  save() {
    this.isSaving = true;
    const donationRequest = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.donationRequestService.update(donationRequest));
    } else {
      this.subscribeToSaveResponse(this.donationRequestService.create(donationRequest));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<DonationRequest>>) {
    result.subscribe(
      (res: HttpResponse<DonationRequest>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `DonationRequest ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/donation-request');
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

  private createFromForm(): DonationRequest {
    return {
      ...new DonationRequest(),
      id: this.form.get(['id']).value,
      cause: this.form.get(['cause']).value,
      paymentInfo: this.form.get(['paymentInfo']).value,
      info: this.form.get(['info']).value,
      totalAmount: this.form.get(['totalAmount']).value,
      contact: this.form.get(['contact']).value,
      amountRaised: this.form.get(['amountRaised']).value,
    };
  }
}
