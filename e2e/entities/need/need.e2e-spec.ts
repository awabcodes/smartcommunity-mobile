import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { NeedComponentsPage, NeedDetailPage, NeedUpdatePage } from './need.po';

describe('Need e2e test', () => {
  let loginPage: LoginPage;
  let needComponentsPage: NeedComponentsPage;
  let needUpdatePage: NeedUpdatePage;
  let needDetailPage: NeedDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Needs';
  const SUBCOMPONENT_TITLE = 'Need';
  let lastElement: any;
  let isVisible = false;

  const name = 'name';
  const info = 'info';
  const contact = 'contact';
  const quantity = 'quantity';

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

  it('should load Needs', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Need')
      .first()
      .click();

    needComponentsPage = new NeedComponentsPage();
    await browser.wait(ec.visibilityOf(needComponentsPage.title), 5000);
    expect(await needComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(ec.or(ec.visibilityOf(needComponentsPage.entities.get(0)), ec.visibilityOf(needComponentsPage.noResult)), 5000);
  });

  it('should create Need', async () => {
    initNumberOfEntities = await needComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(needComponentsPage.createButton), 5000);
    await needComponentsPage.clickOnCreateButton();
    needUpdatePage = new NeedUpdatePage();
    await browser.wait(ec.visibilityOf(needUpdatePage.pageTitle), 1000);
    expect(await needUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await needUpdatePage.setNameInput(name);
    await needUpdatePage.setInfoInput(info);
    await needUpdatePage.setContactInput(contact);
    await needUpdatePage.setImageInput(image);
    await needUpdatePage.setQuantityInput(quantity);

    await needUpdatePage.save();
    await browser.wait(ec.visibilityOf(needComponentsPage.title), 1000);
    expect(await needComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await needComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Need', async () => {
    needComponentsPage = new NeedComponentsPage();
    await browser.wait(ec.visibilityOf(needComponentsPage.title), 5000);
    lastElement = await needComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Need', async () => {
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

  it('should view the last Need', async () => {
    needDetailPage = new NeedDetailPage();
    if (isVisible && (await needDetailPage.pageTitle.isDisplayed())) {
      expect(await needDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await needDetailPage.getNameInput()).toEqual(name);

      expect(await needDetailPage.getInfoInput()).toEqual(info);

      expect(await needDetailPage.getContactInput()).toEqual(contact);

      expect(await needDetailPage.getImageInput()).toEqual(image);

      expect(await needDetailPage.getQuantityInput()).toEqual(quantity);
    }
  });

  it('should delete last Need', async () => {
    needDetailPage = new NeedDetailPage();
    if (isVisible && (await needDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await needDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(needComponentsPage.title), 3000);
      expect(await needComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await needComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Needs tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
