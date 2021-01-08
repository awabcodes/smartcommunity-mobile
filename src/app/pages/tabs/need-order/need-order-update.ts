import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NeedOrder } from './need-order.model';
import { NeedOrderService } from './need-order.service';
import { Need } from '../need';
import { Account } from 'src/model/account.model';
import { AccountService } from 'src/app/services/auth/account.service';

@Component({
  selector: 'page-need-order-update',
  templateUrl: 'need-order-update.html',
})
export class NeedOrderUpdatePage implements OnInit {
  needOrder: NeedOrder;
  need: Need;
  account: Account;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    quantity: [null, [Validators.required]],
    note: [null, []]
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private accountService: AccountService,
    private needOrderService: NeedOrderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.need = this.needOrderService.need;
    this.accountService.identity().then((account) => this.account = account)
  }

  save() {
    this.isSaving = true;
    const needOrder = this.createFromForm();

    this.subscribeToSaveResponse(this.needOrderService.create(needOrder));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<NeedOrder>>) {
    result.subscribe(
      (res: HttpResponse<NeedOrder>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `NeedOrder ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/need-order');
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

  private createFromForm(): NeedOrder {
    return {
      ...new NeedOrder(),
      id: this.form.get(['id']).value,
      quantity: this.form.get(['quantity']).value,
      note: this.form.get(['note']).value,
      userId: this.account.id,
      needId: this.need.id,
    };
  }
}
