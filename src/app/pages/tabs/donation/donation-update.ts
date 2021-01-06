import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Donation } from './donation.model';
import { DonationService } from './donation.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { DonationRequest, DonationRequestService } from '../donation-request';

@Component({
  selector: 'page-donation-update',
  templateUrl: 'donation-update.html',
})
export class DonationUpdatePage implements OnInit {
  donation: Donation;
  users: User[];
  donationRequests: DonationRequest[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    amount: [null, [Validators.required]],
    receiptNumber: [null, []],
    userId: [null, [Validators.required]],
    requestId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private donationRequestService: DonationRequestService,
    private donationService: DonationService
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
    this.donationRequestService.query().subscribe(
      (data) => {
        this.donationRequests = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.donation = response.data;
      this.isNew = this.donation.id === null || this.donation.id === undefined;
      this.updateForm(this.donation);
    });
  }

  updateForm(donation: Donation) {
    this.form.patchValue({
      id: donation.id,
      amount: donation.amount,
      receiptNumber: donation.receiptNumber,
      userId: donation.userId,
      requestId: donation.requestId,
    });
  }

  save() {
    this.isSaving = true;
    const donation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.donationService.update(donation));
    } else {
      this.subscribeToSaveResponse(this.donationService.create(donation));
    }
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
    this.navController.navigateBack('/tabs/entities/donation');
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
      userId: this.form.get(['userId']).value,
      requestId: this.form.get(['requestId']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareDonationRequest(first: DonationRequest, second: DonationRequest): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackDonationRequestById(index: number, item: DonationRequest) {
    return item.id;
  }
}
