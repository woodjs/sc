import { EpcNgPage } from './app.po';

describe('epc-ng App', () => {
  let page: EpcNgPage;

  beforeEach(() => {
    page = new EpcNgPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
