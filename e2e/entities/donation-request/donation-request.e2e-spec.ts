import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { DonationRequestComponentsPage, DonationRequestDetailPage, DonationRequestUpdatePage } from './donation-request.po';

describe('DonationRequest e2e test', () => {
  let loginPage: LoginPage;
  let donationRequestComponentsPage: DonationRequestComponentsPage;
  let donationRequestUpdatePage: DonationRequestUpdatePage;
  let donationRequestDetailPage: DonationRequestDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Donation Requests';
  const SUBCOMPONENT_TITLE = 'Donation Request';
  let lastElement: any;
  let isVisible = false;

  const cause = 'cause';
  const paymentInfo = 'paymentInfo';
  const info = 'info';
  const totalAmount = '10';
  const contact = 'contact';
  const amountRaised = '10';

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

  it('should load DonationRequests', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'DonationRequest')
      .first()
      .click();

    donationRequestComponentsPage = new DonationRequestComponentsPage();
    await browser.wait(ec.visibilityOf(donationRequestComponentsPage.title), 5000);
    expect(await donationRequestComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(donationRequestComponentsPage.entities.get(0)), ec.visibilityOf(donationRequestComponentsPage.noResult)),
      5000
    );
  });

  it('should create DonationRequest', async () => {
    initNumberOfEntities = await donationRequestComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(donationRequestComponentsPage.createButton), 5000);
    await donationRequestComponentsPage.clickOnCreateButton();
    donationRequestUpdatePage = new DonationRequestUpdatePage();
    await browser.wait(ec.visibilityOf(donationRequestUpdatePage.pageTitle), 1000);
    expect(await donationRequestUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await donationRequestUpdatePage.setCauseInput(cause);
    await donationRequestUpdatePage.setPaymentInfoInput(paymentInfo);
    await donationRequestUpdatePage.setInfoInput(info);
    await donationRequestUpdatePage.setTotalAmountInput(totalAmount);
    await donationRequestUpdatePage.setContactInput(contact);
    await donationRequestUpdatePage.setAmountRaisedInput(amountRaised);

    await donationRequestUpdatePage.save();
    await browser.wait(ec.visibilityOf(donationRequestComponentsPage.title), 1000);
    expect(await donationRequestComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await donationRequestComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last DonationRequest', async () => {
    donationRequestComponentsPage = new DonationRequestComponentsPage();
    await browser.wait(ec.visibilityOf(donationRequestComponentsPage.title), 5000);
    lastElement = await donationRequestComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last DonationRequest', async () => {
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

  it('should view the last DonationRequest', async () => {
    donationRequestDetailPage = new DonationRequestDetailPage();
    if (isVisible && (await donationRequestDetailPage.pageTitle.isDisplayed())) {
      expect(await donationRequestDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await donationRequestDetailPage.getCauseInput()).toEqual(cause);

      expect(await donationRequestDetailPage.getPaymentInfoInput()).toEqual(paymentInfo);

      expect(await donationRequestDetailPage.getInfoInput()).toEqual(info);

      expect(await donationRequestDetailPage.getTotalAmountInput()).toEqual(totalAmount);

      expect(await donationRequestDetailPage.getContactInput()).toEqual(contact);

      expect(await donationRequestDetailPage.getAmountRaisedInput()).toEqual(amountRaised);
    }
  });

  it('should delete last DonationRequest', async () => {
    donationRequestDetailPage = new DonationRequestDetailPage();
    if (isVisible && (await donationRequestDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await donationRequestDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(donationRequestComponentsPage.title), 3000);
      expect(await donationRequestComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await donationRequestComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish DonationRequests tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
