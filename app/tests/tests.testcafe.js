import { landingPage } from './landing.page';
import { signinPage } from './signin.page';
import { signoutPage } from './signout.page';
import { signupPage } from './signup.page';
import { profilesPage } from './profiles.page';
import { yourSessionsPage } from './yourSessions.page';
import { sessionsPage } from './sessions.page';
import { yourProfilePage } from './yourProfile.page';
import { addSessionPage } from './addsession.page';
import { navBar } from './navbar.component';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'grayson@hawaii.edu', password: 'foo', firstName: 'Grayson', lastName: 'Levy' };

/** fixture('Fitness Finder test')
  .page('https://fitness-finder.xyz'); */

fixture('Fitness Finder test')
  .page('http://localhost:3000/');

test('Test that landing page shows up', async (testController) => {
  await landingPage.isDisplayed(testController);
});

test('Test that signin and signout work', async (testController) => {
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that signup page, then logout works', async (testController) => {
  // Create a new user email address that's guaranteed to be unique.
  const newUser = `user-${new Date().getTime()}@foo.com`;
  await navBar.gotoSignupPage(testController);
  await signupPage.isDisplayed(testController);
  await signupPage.signupUser(testController, newUser, credentials.password);
  // New user has successfully logged in, so now let's logout.
  await navBar.logout(testController);
  await signoutPage.isDisplayed(testController);
});

test('Test that profiles page displays', async (testController) => {
  await navBar.gotoProfilesPage(testController);
  await profilesPage.isDisplayed(testController);
  await profilesPage.hasDefaultProfiles(testController);
});

test('Test that sessions page displays', async (testController) => {
  await navBar.gotoSessionsPage(testController);
  await sessionsPage.isDisplayed(testController);
  await sessionsPage.hasDefaultProjects(testController);
});

test('Test that home page display and profile modification works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await yourProfilePage.isDisplayed(testController);
  await yourProfilePage.updateProfile(testController, credentials.firstName);
  await navBar.ensureLogout(testController);
});

test('Test that addSession page works', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoAddSessionPage(testController);
  await addSessionPage.isDisplayed(testController);
  await addSessionPage.addSession(testController);
});

test('Test that Your Sessions page displays and functions', async (testController) => {
  await navBar.ensureLogout(testController);
  await navBar.gotoSigninPage(testController);
  await signinPage.signin(testController, credentials.username, credentials.password);
  await navBar.gotoYourSessionsPage(testController);
  await yourSessionsPage.isDisplayed(testController);
  await yourSessionsPage.hasDefaultSessions(testController);
});
