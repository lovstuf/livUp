import { LivupCoPage } from './app.po';

describe('livup-co App', function() {
  let page: LivupCoPage;

  beforeEach(() => {
    page = new LivupCoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('lc works!');
  });
});
