import { element, by, browser, ElementFinder } from 'protractor';

export class PollChoiceComponentsPage {
  createButton = element(by.css('ion-fab-button'));
  viewButtons = element.all(by.css('ion-item'));
  title = element.all(by.css('ion-title')).get(2);
  noResult = element(by.cssContainingText('ion-label', 'No Poll Choices found.'));
  entities = element.all(by.css('page-poll-choice ion-item'));

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

export class PollChoiceUpdatePage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  saveButton = element.all(by.css('ion-button')).get(1);

  choiceInput = element(by.css('ion-input[formControlName="choice"] input'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }

  async setChoiceInput(choice: string): Promise<void> {
    await this.choiceInput.sendKeys(choice);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }
}

export class PollChoiceDetailPage {
  pageTitle = element.all(by.css('ion-title')).get(3);
  deleteButton = element(by.css('ion-button[color="danger"]'));
  choiceInput = element.all(by.css('span')).get(1);

  async getChoiceInput(): Promise<string> {
    return await this.choiceInput.getText();
  }

  async clickOnDeleteButton(): Promise<void> {
    await this.deleteButton.click();
  }

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getText();
  }
}
