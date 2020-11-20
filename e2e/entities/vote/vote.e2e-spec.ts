import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { VoteComponentsPage, VoteDetailPage, VoteUpdatePage } from './vote.po';

describe('Vote e2e test', () => {
  let loginPage: LoginPage;
  let voteComponentsPage: VoteComponentsPage;
  let voteUpdatePage: VoteUpdatePage;
  let voteDetailPage: VoteDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Votes';
  const SUBCOMPONENT_TITLE = 'Vote';
  let lastElement: any;
  let isVisible = false;

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

  it('should load Votes', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Vote')
      .first()
      .click();

    voteComponentsPage = new VoteComponentsPage();
    await browser.wait(ec.visibilityOf(voteComponentsPage.title), 5000);
    expect(await voteComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(voteComponentsPage.entities.get(0)), ec.visibilityOf(voteComponentsPage.noResult)), 5000);
  });

  it('should create Vote', async () => {
    initNumberOfEntities = await voteComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(voteComponentsPage.createButton), 5000);
    await voteComponentsPage.clickOnCreateButton();
    voteUpdatePage = new VoteUpdatePage();
    await browser.wait(ec.visibilityOf(voteUpdatePage.pageTitle), 1000);
    expect(await voteUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await voteUpdatePage.save();
    await browser.wait(ec.visibilityOf(voteComponentsPage.title), 1000);
    expect(await voteComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await voteComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Vote', async () => {
    voteComponentsPage = new VoteComponentsPage();
    await browser.wait(ec.visibilityOf(voteComponentsPage.title), 5000);
    lastElement = await voteComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Vote', async () => {
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

  it('should view the last Vote', async () => {
    voteDetailPage = new VoteDetailPage();
    if (isVisible && (await voteDetailPage.pageTitle.isDisplayed())) {
      expect(await voteDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);
    }
  });

  it('should delete last Vote', async () => {
    voteDetailPage = new VoteDetailPage();
    if (isVisible && (await voteDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await voteDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(voteComponentsPage.title), 3000);
      expect(await voteComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await voteComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Votes tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
