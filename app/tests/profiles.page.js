import { Selector } from 'testcafe';

class ProfilesPage {
  constructor() {
    this.pageId = '#profiles-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks that the current page has at least two profiles on it.  */
  async hasDefaultProfiles(testController) {
    const cardCount = Selector('.ui .card').count;
    await testController.expect(cardCount).gte(33);
  }
}

export const profilesPage = new ProfilesPage();
