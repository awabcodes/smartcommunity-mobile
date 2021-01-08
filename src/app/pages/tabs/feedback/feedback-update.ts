import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Feedback, FeedbackStatus } from './feedback.model';
import { FeedbackService } from './feedback.service';
import { Account } from 'src/model/account.model';
import { AccountService } from 'src/app/services/auth/account.service';

@Component({
  selector: 'page-feedback-update',
  templateUrl: 'feedback-update.html',
})
export class FeedbackUpdatePage implements OnInit {
  feedback: Feedback;
  account: Account;
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    title: [null, [Validators.required]],
    content: [null, [Validators.required]],
    type: [null, [Validators.required]],
    image: [null, []],
    imageContentType: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private dataUtils: JhiDataUtils,

    private elementRef: ElementRef,
    private camera: Camera,
    private accountService: AccountService,
    private feedbackService: FeedbackService
  ) {
    this.feedback = new Feedback();

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    // Set the Camera options
    this.cameraOptions = {
      quality: 100,
      targetWidth: 900,
      targetHeight: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      allowEdit: true,
      sourceType: 1,
    };
  }

  ngOnInit() {
    this.accountService.identity().then(
      (data) => (this.account = data),
      (error) => this.onError(error)
    );
  }

  save() {
    this.isSaving = true;
    const feedback = this.createFromForm();

    this.subscribeToSaveResponse(this.feedbackService.create(feedback));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Feedback>>) {
    result.subscribe(
      (res: HttpResponse<Feedback>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Feedback ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/feedback');
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

  private createFromForm(): Feedback {
    return {
      ...new Feedback(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      content: this.form.get(['content']).value,
      type: this.form.get(['type']).value,
      status: FeedbackStatus.OPEN,
      creationDate: new Date(),
      image: this.form.get(['image']).value,
      imageContentType: this.form.get(['imageContentType']).value,
      userId: this.account.id,
    };
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field, isImage) {
    this.dataUtils.loadFileToForm(event, this.form, field, isImage).subscribe();
    this.processWebImage(event, field);
  }

  getPicture(fieldName) {
    if (Camera.installed()) {
      this.camera.getPicture(this.cameraOptions).then(
        (data) => {
          this.feedback[fieldName] = data;
          this.feedback[fieldName + 'ContentType'] = 'image/jpeg';
          this.form.patchValue({ [fieldName]: data });
          this.form.patchValue({ [fieldName + 'ContentType']: 'image/jpeg' });
        },
        (err) => {
          alert('Unable to take photo');
        }
      );
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event, fieldName) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      const imageType = event.target.files[0].type;
      imageData = imageData.substring(imageData.indexOf(',') + 1);

      this.form.patchValue({ [fieldName]: imageData });
      this.form.patchValue({ [fieldName + 'ContentType']: imageType });
      this.feedback[fieldName] = imageData;
      this.feedback[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.feedback, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
}
