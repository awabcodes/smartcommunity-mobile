import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from './services/login/login.service';

const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private loginService: LoginService,
    private menu: MenuController,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    SplashScreen.hide();
    this.initTranslate();
  }

  initTranslate() {
    const enLang = 'en';

    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(enLang);

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use(enLang); // Set your language here
    }

    // this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
    //   this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    // });
  }

  logout() {
    this.loginService.logout();
    this.menu.close();
    this.navController.navigateBack('');
  }
}
