import { Selector } from 'testcafe';
import { yourProfilePage } from './yourProfile.page';

class AddSessionPage {
  constructor() {
    this.pageId = '#add-session-page';
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed(testController) {
    await testController.expect(this.pageSelector.exists).ok();
  }

  /** Checks this page is displayed, then adds a new session */
  async addSession(testController) {
    const title = `radgrad-${new Date().getTime()}`;
    const owner = 'https://www.radgrad.org/img/radgrad_logo.png';
    const location = 'https://radgrad.org';
    const date = 'date';
    const description = 'Growing awesome computer scientists, one graduate at a time.';
    await this.isDisplayed(testController);
    // Define the new project
    await testController.typeText('#title', title);
    await testController.typeText('#owner', owner);
    await testController.typeText('#location', location);
    await testController.typeText('#date', date);
    await testController.typeText('#yourProfilepage', yourProfilePage);
    await testController.typeText('#description', description);

    // Select two interests.
    const interestsSelector = Selector('#interests');
    const RunningOption = interestsSelector.find('#Running');
    const HikingOption = interestsSelector.find('#Hiking');
    await testController.click(interestsSelector);
    await testController.click(RunningOption);
    await testController.click(HikingOption);
    await testController.click(interestsSelector);

    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addSessionPage = new AddSessionPage();
