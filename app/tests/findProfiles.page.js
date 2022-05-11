import { Selector } from 'testcafe';

class FilterProfilesPage {
  constructor() {
    this.pageId = '#filter-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks that the current page has all default profiles with running interests.  */
  async hasDefaultProfiles(testController) {
    // Select a interest to filter by.
    const interestsSelector = Selector('#interests');
    const RunningOption = interestsSelector.find('#Running');
    await testController.click(interestsSelector);
    await testController.click(RunningOption);
    await testController.click(interestsSelector);
    await testController.click('#submit');
    const cardCount = Selector('.ui .card').count;
    await testController.expect(cardCount).gte(18);
  }
}

export const filterProfilesPage = new FilterProfilesPage();
