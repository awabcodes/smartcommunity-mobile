import { element, by, browser, ElementFinder } from 'protractor';

export class NeedComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Needs found.'));
  entities = element.all(by.css('page-need ion-item'));

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

export class NeedUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  nameInput = element(by.css('ion-input[formControlName="name"] input'));
  infoInput = element(by.css('ion-input[formControlName="info"] input'));
  contactInput = element(by.css('ion-input[formControlName="contact"] input'));
  imageInput = element(by.css('ion-input[formControlName="image"] input'));
  quantityInput = element(by.css('ion-input[formControlName="quantity"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }
  async setInfoInput(info: string): Promise<void> {
    await this.infoInput.sendKeys(info);
  }
  async setContactInput(contact: string): Promise<void> {
    await this.contactInput.sendKeys(contact);
  }
  async setImageInput(image: string): Promise<void> {
    await this.imageInput.sendKeys(image);
  }
  async setQuantityInput(quantity: string): Promise<void> {
    await this.quantityInput.sendKeys(quantity);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class NeedDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  nameInput = element.all(by.css('span')).get(1);

  infoInput = element.all(by.css('span')).get(2);

  contactInput = element.all(by.css('span')).get(4);

  imageInput = element.all(by.css('span')).get(5);

  quantityInput = element.all(by.css('span')).get(6);

  async getNameInput(): Promise<string> {
    return await this.nameInput.getText();
  }

  async getInfoInput(): Promise<string> {
    return await this.infoInput.getText();
  }

  async getContactInput(): Promise<string> {
    return await this.contactInput.getText();
  }

  async getImageInput(): Promise<string> {
    return await this.imageInput.getText();
  }

  async getQuantityInput(): Promise<string> {
    return await this.quantityInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
