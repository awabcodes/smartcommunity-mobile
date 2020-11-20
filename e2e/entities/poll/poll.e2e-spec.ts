import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { PollComponentsPage, PollDetailPage, PollUpdatePage } from './poll.po';

describe('Poll e2e test', () => {
  let loginPage: LoginPage;
  let pollComponentsPage: PollComponentsPage;
  let pollUpdatePage: PollUpdatePage;
  let pollDetailPage: PollDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Polls';
  const SUBCOMPONENT_TITLE = 'Poll';
  let lastElement: any;
  let isVisible = false;

  const question = 'question';
  const createdBy = 'createdBy';

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

  it('should load Polls', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Poll')
      .first()
      .click();

    pollComponentsPage = new PollComponentsPage();
    await browser.wait(ec.visibilityOf(pollComponentsPage.title), 5000);
    expect(await pollComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(pollComponentsPage.entities.get(0)), ec.visibilityOf(pollComponentsPage.noResult)), 5000);
  });

  it('should create Poll', async () => {
    initNumberOfEntities = await pollComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(pollComponentsPage.createButton), 5000);
    await pollComponentsPage.clickOnCreateButton();
    pollUpdatePage = new PollUpdatePage();
    await browser.wait(ec.visibilityOf(pollUpdatePage.pageTitle), 1000);
    expect(await pollUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await pollUpdatePage.setQuestionInput(question);
    await pollUpdatePage.setCreatedByInput(createdBy);

    await pollUpdatePage.save();
    await browser.wait(ec.visibilityOf(pollComponentsPage.title), 1000);
    expect(await pollComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await pollComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Poll', async () => {
    pollComponentsPage = new PollComponentsPage();
    await browser.wait(ec.visibilityOf(pollComponentsPage.title), 5000);
    lastElement = await pollComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Poll', async () => {
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

  it('should view the last Poll', async () => {
    pollDetailPage = new PollDetailPage();
    if (isVisible && (await pollDetailPage.pageTitle.isDisplayed())) {
      expect(await pollDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await pollDetailPage.getQuestionInput()).toEqual(question);

      expect(await pollDetailPage.getCreatedByInput()).toEqual(createdBy);
    }
  });

  it('should delete last Poll', async () => {
    pollDetailPage = new PollDetailPage();
    if (isVisible && (await pollDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await pollDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(pollComponentsPage.title), 3000);
      expect(await pollComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await pollComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Polls tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
