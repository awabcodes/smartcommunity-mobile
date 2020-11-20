import { browser, by, element, ExpectedConditions as ec } from 'protractor';
import { LoginPage } from '../../pages/login.po';
import { AnnouncementComponentsPage, AnnouncementDetailPage, AnnouncementUpdatePage } from './announcement.po';

describe('Announcement e2e test', () => {
  let loginPage: LoginPage;
  let announcementComponentsPage: AnnouncementComponentsPage;
  let announcementUpdatePage: AnnouncementUpdatePage;
  let announcementDetailPage: AnnouncementDetailPage;
  let initNumberOfEntities: number;
  const COMPONENT_TITLE = 'Announcements';
  const SUBCOMPONENT_TITLE = 'Announcement';
  let lastElement: any;
  let isVisible = false;

  const title = 'title';
  const content = 'content';
  const location = 'location';
  const contact = 'contact';

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

  it('should load Announcements', async () => {
    // go to entity component page
    const tabEntities = element(by.css('ion-tab-button[tab="entities"]'));
    await browser.wait(ec.elementToBeClickable(tabEntities), 3000);
    await tabEntities.click();
    await element
      .all(by.css('ion-item'))
      .filter(async (el) => (await el.element(by.css('h2')).getText()) === 'Announcement')
      .first()
      .click();

    announcementComponentsPage = new AnnouncementComponentsPage();
    await browser.wait(ec.visibilityOf(announcementComponentsPage.title), 5000);
    expect(await announcementComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    await browser.wait(
      ec.or(ec.visibilityOf(announcementComponentsPage.entities.get(0)), ec.visibilityOf(announcementComponentsPage.noResult)),
      5000
    );
  });

  it('should create Announcement', async () => {
    initNumberOfEntities = await announcementComponentsPage.getEntitiesNumber();
    await browser.wait(ec.elementToBeClickable(announcementComponentsPage.createButton), 5000);
    await announcementComponentsPage.clickOnCreateButton();
    announcementUpdatePage = new AnnouncementUpdatePage();
    await browser.wait(ec.visibilityOf(announcementUpdatePage.pageTitle), 1000);
    expect(await announcementUpdatePage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

    await announcementUpdatePage.setTitleInput(title);
    await announcementUpdatePage.setContentInput(content);
    await announcementUpdatePage.typeSelectLastOption();
    await announcementUpdatePage.setLocationInput(location);
    await announcementUpdatePage.setImageInput(image);
    await announcementUpdatePage.setContactInput(contact);

    await announcementUpdatePage.save();
    await browser.wait(ec.visibilityOf(announcementComponentsPage.title), 1000);
    expect(await announcementComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
    expect(await announcementComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities + 1);
  });

  it('should get the last Announcement', async () => {
    announcementComponentsPage = new AnnouncementComponentsPage();
    await browser.wait(ec.visibilityOf(announcementComponentsPage.title), 5000);
    lastElement = await announcementComponentsPage.viewButtons.last().getWebElement();
  });

  it('should scroll the last Announcement', async () => {
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

  it('should view the last Announcement', async () => {
    announcementDetailPage = new AnnouncementDetailPage();
    if (isVisible && (await announcementDetailPage.pageTitle.isDisplayed())) {
      expect(await announcementDetailPage.getPageTitle()).toEqual(SUBCOMPONENT_TITLE);

      expect(await announcementDetailPage.getTitleInput()).toEqual(title);

      expect(await announcementDetailPage.getContentInput()).toEqual(content);

      expect(await announcementDetailPage.getLocationInput()).toEqual(location);

      expect(await announcementDetailPage.getImageInput()).toEqual(image);

      expect(await announcementDetailPage.getContactInput()).toEqual(contact);
    }
  });

  it('should delete last Announcement', async () => {
    announcementDetailPage = new AnnouncementDetailPage();
    if (isVisible && (await announcementDetailPage.deleteButton.isDisplayed())) {
      await browser.executeScript('arguments[0].click()', await announcementDetailPage.deleteButton.getWebElement());

      const alertConfirmButton = element.all(by.className('alert-button')).last();

      await browser.wait(ec.elementToBeClickable(alertConfirmButton), 3000);
      alertConfirmButton.click();
      await browser.wait(ec.visibilityOf(announcementComponentsPage.title), 3000);
      expect(await announcementComponentsPage.getTitle()).toEqual(COMPONENT_TITLE);
      expect(await announcementComponentsPage.getEntitiesNumber()).toEqual(initNumberOfEntities);
    }
  });

  it('finish Announcements tests performing logout', async () => {
    // go to home page
    const tabHome = element(by.css('ion-tab-button[tab="home"]'));
    await browser.wait(ec.elementToBeClickable(tabHome), 3000);
    await tabHome.click();
    await browser.wait(ec.elementToBeClickable(loginPage.logoutButton), 3000);
    await loginPage.logout();
  });
});
