import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Announcement } from './announcement.model';
import { AnnouncementService } from './announcement.service';

@Component({
  selector: 'page-announcement-update',
  templateUrl: 'announcement-update.html',
})
export class AnnouncementUpdatePage implements OnInit {
  announcement: Announcement;
  @ViewChild('fileInput', { static: false }) fileInput;
  cameraOptions: CameraOptions;
  creationDate: string;
  announcementDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [],
    title: [null, [Validators.required]],
    content: [null, [Validators.required]],
    creationDate: [null, [Validators.required]],
    type: [null, [Validators.required]],
    location: [null, []],
    image: [null, []],
    imageContentType: [null, []],
    contact: [null, []],
    announcementDate: [null, []],
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
    private announcementService: AnnouncementService
  ) {
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
    this.activatedRoute.data.subscribe((response) => {
      this.announcement = response.data;
      this.isNew = this.announcement.id === null || this.announcement.id === undefined;
      this.updateForm(this.announcement);
    });
  }

  updateForm(announcement: Announcement) {
    this.form.patchValue({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      creationDate: this.isNew ? new Date().toISOString() : announcement.creationDate,
      type: announcement.type,
      location: announcement.location,
      image: announcement.image,
      imageContentType: announcement.imageContentType,
      contact: announcement.contact,
      announcementDate: this.isNew ? new Date().toISOString() : announcement.announcementDate,
    });
  }

  save() {
    this.isSaving = true;
    const announcement = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.announcementService.update(announcement));
    } else {
      this.subscribeToSaveResponse(this.announcementService.create(announcement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Announcement>>) {
    result.subscribe(
      (res: HttpResponse<Announcement>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Announcement ${action} successfully.`, duration: 2000, position: 'middle' });
    toast.present();
    this.navController.navigateBack('/tabs/entities/announcement');
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

  private createFromForm(): Announcement {
    return {
      ...new Announcement(),
      id: this.form.get(['id']).value,
      title: this.form.get(['title']).value,
      content: this.form.get(['content']).value,
      creationDate: new Date(this.form.get(['creationDate']).value),
      type: this.form.get(['type']).value,
      location: this.form.get(['location']).value,
      image: this.form.get(['image']).value,
      imageContentType: this.form.get(['imageContentType']).value,
      contact: this.form.get(['contact']).value,
      announcementDate: new Date(this.form.get(['announcementDate']).value),
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
          this.announcement[fieldName] = data;
          this.announcement[fieldName + 'ContentType'] = 'image/jpeg';
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
      this.announcement[fieldName] = imageData;
      this.announcement[fieldName + 'ContentType'] = imageType;
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.dataUtils.clearInputImage(this.announcement, this.elementRef, field, fieldContentType, idInput);
    this.form.patchValue({ [field]: '' });
  }
}
