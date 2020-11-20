import { element, by, browser, ElementFinder } from 'protractor';

export class DonationComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Donations found.'));
  entities = element.all(by.css('page-donation ion-item'));

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

export class DonationUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  amountInput = element(by.css('ion-input[formControlName="amount"] input'));
  receiptNumberInput = element(by.css('ion-input[formControlName="receiptNumber"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setAmountInput(amount: string): Promise<void> {
    await this.amountInput.sendKeys(amount);
  }
  async setReceiptNumberInput(receiptNumber: string): Promise<void> {
    await this.receiptNumberInput.sendKeys(receiptNumber);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class DonationDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  amountInput = element.all(by.css('span')).get(1);

  receiptNumberInput = element.all(by.css('span')).get(2);

  async getAmountInput(): Promise<string> {
    return await this.amountInput.getText();
  }

  async getReceiptNumberInput(): Promise<string> {
    return await this.receiptNumberInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
