import { element, by, browser, ElementFinder } from 'protractor';

export class NeedOrderComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Need Orders found.'));
  entities = element.all(by.css('page-need-order ion-item'));

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

export class NeedOrderUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  quantityInput = element(by.css('ion-input[formControlName="quantity"] input'));
  noteInput = element(by.css('ion-input[formControlName="note"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setQuantityInput(quantity: string): Promise<void> {
    await this.quantityInput.sendKeys(quantity);
  }
  async setNoteInput(note: string): Promise<void> {
    await this.noteInput.sendKeys(note);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class NeedOrderDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  quantityInput = element.all(by.css('span')).get(1);

  noteInput = element.all(by.css('span')).get(2);

  async getQuantityInput(): Promise<string> {
    return await this.quantityInput.getText();
  }

  async getNoteInput(): Promise<string> {
    return await this.noteInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
