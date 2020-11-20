import { element, by, browser, ElementFinder } from 'protractor';

export class DonationRequestComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Donation Requests found.'));
  entities = element.all(by.css('page-donation-request ion-item'));

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

export class DonationRequestUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  causeInput = element(by.css('ion-input[formControlName="cause"] input'));
  paymentInfoInput = element(by.css('ion-input[formControlName="paymentInfo"] input'));
  infoInput = element(by.css('ion-input[formControlName="info"] input'));
  totalAmountInput = element(by.css('ion-input[formControlName="totalAmount"] input'));
  contactInput = element(by.css('ion-input[formControlName="contact"] input'));
  amountRaisedInput = element(by.css('ion-input[formControlName="amountRaised"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setCauseInput(cause: string): Promise<void> {
    await this.causeInput.sendKeys(cause);
  }
  async setPaymentInfoInput(paymentInfo: string): Promise<void> {
    await this.paymentInfoInput.sendKeys(paymentInfo);
  }
  async setInfoInput(info: string): Promise<void> {
    await this.infoInput.sendKeys(info);
  }
  async setTotalAmountInput(totalAmount: string): Promise<void> {
    await this.totalAmountInput.sendKeys(totalAmount);
  }
  async setContactInput(contact: string): Promise<void> {
    await this.contactInput.sendKeys(contact);
  }
  async setAmountRaisedInput(amountRaised: string): Promise<void> {
    await this.amountRaisedInput.sendKeys(amountRaised);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class DonationRequestDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  causeInput = element.all(by.css('span')).get(1);

  paymentInfoInput = element.all(by.css('span')).get(2);

  infoInput = element.all(by.css('span')).get(3);

  totalAmountInput = element.all(by.css('span')).get(4);

  contactInput = element.all(by.css('span')).get(5);

  amountRaisedInput = element.all(by.css('span')).get(6);

  async getCauseInput(): Promise<string> {
    return await this.causeInput.getText();
  }

  async getPaymentInfoInput(): Promise<string> {
    return await this.paymentInfoInput.getText();
  }

  async getInfoInput(): Promise<string> {
    return await this.infoInput.getText();
  }

  async getTotalAmountInput(): Promise<string> {
    return await this.totalAmountInput.getText();
  }

  async getContactInput(): Promise<string> {
    return await this.contactInput.getText();
  }

  async getAmountRaisedInput(): Promise<string> {
    return await this.amountRaisedInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
