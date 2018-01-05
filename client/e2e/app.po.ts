import { browser, by, element } from 'protractor';

export class GlAngularTrainingPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('gl-root h1')).getText();
  }
}
