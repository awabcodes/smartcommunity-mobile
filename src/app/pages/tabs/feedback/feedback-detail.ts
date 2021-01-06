import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { Feedback } from './feedback.model';
import { FeedbackService } from './feedback.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-feedback-detail',
  templateUrl: 'feedback-detail.html',
})
export class FeedbackDetailPage implements OnInit {
  feedback: Feedback = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private feedbackService: FeedbackService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.feedback = response.data;
    });
  }

  open(item: Feedback) {
    this.navController.navigateForward('/tabs/feedback/' + item.id + '/edit');
  }

  async deleteModal(item: Feedback) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.feedbackService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/feedback');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
