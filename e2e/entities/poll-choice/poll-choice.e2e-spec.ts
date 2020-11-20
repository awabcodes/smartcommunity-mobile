import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PollChoiceComponentsPage, PollChoiceDetailPage, PollChoiceUpdatePage } from './poll-choice.po';

describe('PollChoice e2e test', () => {
  let loginPage: LoginPage;
  let pollChoiceComponentsPage: PollChoiceComponentsPage;
  let pollChoiceUpdatePage: PollChoiceUpdatePage;
  let pollChoiceDetailPage: PollChoiceDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Poll Choices';
  const SUBCOMPONENT_TITLE = 'Poll Choice';
  let lastElement: any;
  let isVisible = false;

  const choice = 'choice';

  beforeAll(async () => {
    loginPage = new LoginPage();
    await loginPage.navigateTo('/');
    await loginPage.signInButton.click();
    const username = process.env.E2E_USERNAME || 'admin';
    const password = process.env.E2E_PASSWORD || 'admin';
    await browser.wait(ec.elementToBeClickable(loginPage.loginButton), 3000);
    await loginPage.login(username, password);
    await browser.wait(ec.visibilityOf(loginPage.logoutButton), 1000);
  });

  it('should load PollChoices', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'PollChoice')
      .first()
      .click();

    pollChoiceComponentsPage = new PollChoiceComponentsPage();
    await browser.wait(ec.visibilityOf(pollChoiceComponentsPage.title), 5000);
    expect(await pollChoiceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(pollChoiceComponentsPage.entities.get(0)), ec.visibilityOf(pollChoiceComponentsPage.noResult)),
      5000
    );
  });

  it('should create PollChoice', async () => {
    initNumberOfEntities = await pollChoiceComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(pollChoiceComponentsPage.createButton), 5000);
    await pollChoiceComponentsPage.clickOnCreateButton();
    pollChoiceUpdatePage = new PollChoiceUpdatePage();
    await browser.wait(ec.visibilityOf(pollChoiceUpdatePage.pageTitle), 1000);
    expect(await pollChoiceUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await pollChoiceUpdatePage.setChoiceInput(choice);

    await pollChoiceUpdatePage.save();
    await browser.wait(ec.visibilityOf(pollChoiceComponentsPage.title), 1000);
    expect(await pollChoiceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await pollChoiceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last PollChoice', async () => {
    pollChoiceComponentsPage = new PollChoiceComponentsPage();
    await browser.wait(ec.visibilityOf(pollChoiceComponentsPage.title), 5000);
    lastElement = await pollChoiceComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last PollChoice', async () => {
    browser
      .executeScript('arguments[0].scrollIntoView()', lastElement)
      .then(async () => {
        if ((await lastElement.isEnabled()) && (await lastElement.isDisplayed())) {
          browser
            .executeScript('arguments[0].click()', lastElement)
            .then(async () => {
              isVisible = true;
            })
            .catch();
        }
      })
      .catch();
  });

  it('should view the last PollChoice', async () => {
    pollChoiceDetailPage = new PollChoiceDetailPage();
    if (isVisible && (await pollChoiceDetailPage.pageTitle.isDisplayed())) {
      expect(await pollChoiceDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await pollChoiceDetailPage.getChoiceInput()).toEqual(choice);
    }
  });

  it('should delete last PollChoice', async () => {
    pollChoiceDetailPage = new PollChoiceDetailPage();
    if (isVisible && (await pollChoiceDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await pollChoiceDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(pollChoiceComponentsPage.title), 3000);
      expect(await pollChoiceComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await pollChoiceComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish PollChoices tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
