import { GlAngularTrainingPage } from './app.po';

describe('gl-angular-training App', () => {
  let page: GlAngularTrainingPage;

  beforeEach(() => {
    page = new GlAngularTrainingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to gl!!');
  });
});
