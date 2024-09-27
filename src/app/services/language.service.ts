import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private translate: TranslateService) {}

  initializeLanguage() {
    const browserLang = navigator.language.split('-')[0];
    const lang = ['en', 'fr'].includes(browserLang) ? browserLang : 'en';
    console.log('Detected language:', lang);
    this.translate.setDefaultLang('en');
    this.translate.use(lang);
  }
}
