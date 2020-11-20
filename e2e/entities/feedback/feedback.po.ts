import { element, by, browser, ElementFinder } from 'protractor';

export class FeedbackComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Feedbacks found.'));
  entities = element.all(by.css('page-feedback ion-item'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastViewButton(): Promise<void> {
    await this.viewButtons.last().click();
  }

  async getTitle(): Promise<string> {
    return this.title.getText();
  }

  async getEntitiesNumber(): Promise<number> {
    return await this.entities.count();
  }
}

export class FeedbackUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  contentInput = element(by.css('ion-input[formControlName="content"] input'));
  typeSelect = element(by.css('ion-select[formControlName="type"]'));
  statusSelect = element(by.css('ion-select[formControlName="status"]'));
  imageInput = element(by.css('ion-input[formControlName="image"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }
  async setContentInput(content: string): Promise<void> {
    await this.contentInput.sendKeys(content);
  }
  async typeSelectLastOption(): Promise<void> {
    await this.typeSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.click();
    await browser.sleep(500);
    await element.all(by.className('alert-radio')).last().click();
    await element.all(by.className('alert-button')).last().click();
  }
  async setImageInput(image: string): Promise<void> {
    await this.imageInput.sendKeys(image);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class FeedbackDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  titleInput = element.all(by.css('span')).get(1);

  contentInput = element.all(by.css('span')).get(2);

  imageInput = element.all(by.css('span')).get(6);

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getContentInput(): Promise<string> {
    return await this.contentInput.getText();
  }

  async getImageInput(): Promise<string> {
    return await this.imageInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
