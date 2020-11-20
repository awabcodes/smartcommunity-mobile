import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { DonationComponentsPage, DonationDetailPage, DonationUpdatePage } from './donation.po';

describe('Donation e2e test', () => {
  let loginPage: LoginPage;
  let donationComponentsPage: DonationComponentsPage;
  let donationUpdatePage: DonationUpdatePage;
  let donationDetailPage: DonationDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Donations';
  const SUBCOMPONENT_TITLE = 'Donation';
  let lastElement: any;
  let isVisible = false;

  const amount = '10';
  const receiptNumber = 'receiptNumber';

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

  it('should load Donations', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Donation')
      .first()
      .click();

    donationComponentsPage = new DonationComponentsPage();
    await browser.wait(ec.visibilityOf(donationComponentsPage.title), 5000);
    expect(await donationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(donationComponentsPage.entities.get(0)), ec.visibilityOf(donationComponentsPage.noResult)),
      5000
    );
  });

  it('should create Donation', async () => {
    initNumberOfEntities = await donationComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(donationComponentsPage.createButton), 5000);
    await donationComponentsPage.clickOnCreateButton();
    donationUpdatePage = new DonationUpdatePage();
    await browser.wait(ec.visibilityOf(donationUpdatePage.pageTitle), 1000);
    expect(await donationUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await donationUpdatePage.setAmountInput(amount);
    await donationUpdatePage.setReceiptNumberInput(receiptNumber);

    await donationUpdatePage.save();
    await browser.wait(ec.visibilityOf(donationComponentsPage.title), 1000);
    expect(await donationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await donationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Donation', async () => {
    donationComponentsPage = new DonationComponentsPage();
    await browser.wait(ec.visibilityOf(donationComponentsPage.title), 5000);
    lastElement = await donationComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Donation', async () => {
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

  it('should view the last Donation', async () => {
    donationDetailPage = new DonationDetailPage();
    if (isVisible && (await donationDetailPage.pageTitle.isDisplayed())) {
      expect(await donationDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await donationDetailPage.getAmountInput()).toEqual(amount);

      expect(await donationDetailPage.getReceiptNumberInput()).toEqual(receiptNumber);
    }
  });

  it('should delete last Donation', async () => {
    donationDetailPage = new DonationDetailPage();
    if (isVisible && (await donationDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await donationDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(donationComponentsPage.title), 3000);
      expect(await donationComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await donationComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Donations tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
