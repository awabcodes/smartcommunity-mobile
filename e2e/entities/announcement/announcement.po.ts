import { element, by, browser, ElementFinder } from 'protractor';

export class AnnouncementComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Announcements found.'));
  entities = element.all(by.css('page-announcement ion-item'));

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

export class AnnouncementUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  titleInput = element(by.css('ion-input[formControlName="title"] input'));
  contentInput = element(by.css('ion-input[formControlName="content"] input'));
  typeSelect = element(by.css('ion-select[formControlName="type"]'));
  locationInput = element(by.css('ion-input[formControlName="location"] input'));
  imageInput = element(by.css('ion-input[formControlName="image"] input'));
  contactInput = element(by.css('ion-input[formControlName="contact"] input'));

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
  async setLocationInput(location: string): Promise<void> {
    await this.locationInput.sendKeys(location);
  }
  async setImageInput(image: string): Promise<void> {
    await this.imageInput.sendKeys(image);
  }
  async setContactInput(contact: string): Promise<void> {
    await this.contactInput.sendKeys(contact);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class AnnouncementDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  titleInput = element.all(by.css('span')).get(1);

  contentInput = element.all(by.css('span')).get(2);

  locationInput = element.all(by.css('span')).get(5);

  imageInput = element.all(by.css('span')).get(6);

  contactInput = element.all(by.css('span')).get(7);

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getText();
  }

  async getContentInput(): Promise<string> {
    return await this.contentInput.getText();
  }

  async getLocationInput(): Promise<string> {
    return await this.locationInput.getText();
  }

  async getImageInput(): Promise<string> {
    return await this.imageInput.getText();
  }

  async getContactInput(): Promise<string> {
    return await this.contactInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
