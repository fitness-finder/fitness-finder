import { Selector } from 'testcafe';

class YourSessionsPage {
  constructor() {
    this.pageId = '#your-sessions-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  async hasDefaultSessions(testController) {
    const cardCount = Selector('.ui .card').count;
    await testController.expect(cardCount).gte(2);
  }

  async deleteSession(testController) {
    await testController.click('#delete');
    const cardCount = Selector('.ui .card').count;
    await testController.expect(cardCount).gte(1);
  }
}

export const yourSessionsPage = new YourSessionsPage();
