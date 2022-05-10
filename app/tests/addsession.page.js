import { Selector } from 'testcafe';

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
    const title = 'Long Walk';
    // const owner = 'test@hawaii.edu';
    const location = 'outside';
    const date = '2021-1-1';
    const description = 'Lets go for a long walk in the park';
    await this.isDisplayed(testController);
    // Define the new session
    await testController.typeText('#title', title);
    // await testController.typeText('#owner', owner);
    await testController.typeText('#location', location);
    await testController.typeText('#date', date);
    await testController.typeText('#description', description);

    // Select two interests.
    const interestsSelector = Selector('#interests');
    const RunningOption = interestsSelector.find('#Running');
    const HikingOption = interestsSelector.find('#Hiking');
    await testController.click(interestsSelector);
    await testController.click(RunningOption);
    await testController.click(HikingOption);
    await testController.click(interestsSelector);

    // select skill level
    await testController.click(Selector('label').withText('Beginner'));

    await testController.click('#submit');
    await testController.click(Selector('.swal-button--confirm'));
  }
}

export const addSessionPage = new AddSessionPage();
