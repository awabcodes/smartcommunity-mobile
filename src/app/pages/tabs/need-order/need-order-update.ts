import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NeedOrder } from './need-order.model';
import { NeedOrderService } from './need-order.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Need, NeedService } from '../need';

@Component({
  selector: 'page-need-order-update',
  templateUrl: 'need-order-update.html',
})
export class NeedOrderUpdatePage implements OnInit {
  needOrder: NeedOrder;
  users: User[];
  needs: Need[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    quantity: [null, [Validators.required]],
    note: [null, []],
    userId: [null, [Validators.required]],
    needId: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private needService: NeedService,
    private needOrderService: NeedOrderService
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
    this.needService.query().subscribe(
      (data) => {
        this.needs = data.body;
      },
      (error) => this.onError(error)
    );
    this.activatedRoute.data.subscribe((response) => {
      this.needOrder = response.data;
      this.isNew = this.needOrder.id === null || this.needOrder.id === undefined;
      this.updateForm(this.needOrder);
    });
  }

  updateForm(needOrder: NeedOrder) {
    this.form.patchValue({
      id: needOrder.id,
      quantity: needOrder.quantity,
      note: needOrder.note,
      userId: needOrder.userId,
      needId: needOrder.needId,
    });
  }

  save() {
    this.isSaving = true;
    const needOrder = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.needOrderService.update(needOrder));
    } else {
      this.subscribeToSaveResponse(this.needOrderService.create(needOrder));
    }
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
      userId: this.form.get(['userId']).value,
      needId: this.form.get(['needId']).value,
    };
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareNeed(first: Need, second: Need): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackNeedById(index: number, item: Need) {
    return item.id;
  }
}
