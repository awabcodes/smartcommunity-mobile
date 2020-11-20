import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { NeedOrderComponentsPage, NeedOrderDetailPage, NeedOrderUpdatePage } from './need-order.po';

describe('NeedOrder e2e test', () => {
  let loginPage: LoginPage;
  let needOrderComponentsPage: NeedOrderComponentsPage;
  let needOrderUpdatePage: NeedOrderUpdatePage;
  let needOrderDetailPage: NeedOrderDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Need Orders';
  const SUBCOMPONENT_TITLE = 'Need Order';
  let lastElement: any;
  let isVisible = false;

  const quantity = 'quantity';
  const note = 'note';

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

  it('should load NeedOrders', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'NeedOrder')
      .first()
      .click();

    needOrderComponentsPage = new NeedOrderComponentsPage();
    await browser.wait(ec.visibilityOf(needOrderComponentsPage.title), 5000);
    expect(await needOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(needOrderComponentsPage.entities.get(0)), ec.visibilityOf(needOrderComponentsPage.noResult)),
      5000
    );
  });

  it('should create NeedOrder', async () => {
    initNumberOfEntities = await needOrderComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(needOrderComponentsPage.createButton), 5000);
    await needOrderComponentsPage.clickOnCreateButton();
    needOrderUpdatePage = new NeedOrderUpdatePage();
    await browser.wait(ec.visibilityOf(needOrderUpdatePage.pageTitle), 1000);
    expect(await needOrderUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await needOrderUpdatePage.setQuantityInput(quantity);
    await needOrderUpdatePage.setNoteInput(note);

    await needOrderUpdatePage.save();
    await browser.wait(ec.visibilityOf(needOrderComponentsPage.title), 1000);
    expect(await needOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await needOrderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last NeedOrder', async () => {
    needOrderComponentsPage = new NeedOrderComponentsPage();
    await browser.wait(ec.visibilityOf(needOrderComponentsPage.title), 5000);
    lastElement = await needOrderComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last NeedOrder', async () => {
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

  it('should view the last NeedOrder', async () => {
    needOrderDetailPage = new NeedOrderDetailPage();
    if (isVisible && (await needOrderDetailPage.pageTitle.isDisplayed())) {
      expect(await needOrderDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await needOrderDetailPage.getQuantityInput()).toEqual(quantity);

      expect(await needOrderDetailPage.getNoteInput()).toEqual(note);
    }
  });

  it('should delete last NeedOrder', async () => {
    needOrderDetailPage = new NeedOrderDetailPage();
    if (isVisible && (await needOrderDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await needOrderDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(needOrderComponentsPage.title), 3000);
      expect(await needOrderComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await needOrderComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish NeedOrders tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
