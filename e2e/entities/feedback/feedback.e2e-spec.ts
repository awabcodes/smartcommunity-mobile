import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { FeedbackComponentsPage, FeedbackDetailPage, FeedbackUpdatePage } from './feedback.po';

describe('Feedback e2e test', () => {
  let loginPage: LoginPage;
  let feedbackComponentsPage: FeedbackComponentsPage;
  let feedbackUpdatePage: FeedbackUpdatePage;
  let feedbackDetailPage: FeedbackDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Feedbacks';
  const SUBCOMPONENT_TITLE = 'Feedback';
  let lastElement: any;
  let isVisible = false;

  const title = 'title';
  const content = 'content';

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

  it('should load Feedbacks', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Feedback')
      .first()
      .click();

    feedbackComponentsPage = new FeedbackComponentsPage();
    await browser.wait(ec.visibilityOf(feedbackComponentsPage.title), 5000);
    expect(await feedbackComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(feedbackComponentsPage.entities.get(0)), ec.visibilityOf(feedbackComponentsPage.noResult)),
      5000
    );
  });

  it('should create Feedback', async () => {
    initNumberOfEntities = await feedbackComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(feedbackComponentsPage.createButton), 5000);
    await feedbackComponentsPage.clickOnCreateButton();
    feedbackUpdatePage = new FeedbackUpdatePage();
    await browser.wait(ec.visibilityOf(feedbackUpdatePage.pageTitle), 1000);
    expect(await feedbackUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await feedbackUpdatePage.setTitleInput(title);
    await feedbackUpdatePage.setContentInput(content);
    await feedbackUpdatePage.typeSelectLastOption();
    await feedbackUpdatePage.statusSelectLastOption();
    await feedbackUpdatePage.setImageInput(image);

    await feedbackUpdatePage.save();
    await browser.wait(ec.visibilityOf(feedbackComponentsPage.title), 1000);
    expect(await feedbackComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await feedbackComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Feedback', async () => {
    feedbackComponentsPage = new FeedbackComponentsPage();
    await browser.wait(ec.visibilityOf(feedbackComponentsPage.title), 5000);
    lastElement = await feedbackComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Feedback', async () => {
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

  it('should view the last Feedback', async () => {
    feedbackDetailPage = new FeedbackDetailPage();
    if (isVisible && (await feedbackDetailPage.pageTitle.isDisplayed())) {
      expect(await feedbackDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await feedbackDetailPage.getTitleInput()).toEqual(title);

      expect(await feedbackDetailPage.getContentInput()).toEqual(content);

      expect(await feedbackDetailPage.getImageInput()).toEqual(image);
    }
  });

  it('should delete last Feedback', async () => {
    feedbackDetailPage = new FeedbackDetailPage();
    if (isVisible && (await feedbackDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await feedbackDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(feedbackComponentsPage.title), 3000);
      expect(await feedbackComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await feedbackComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Feedbacks tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
