import { Meteor } from 'meteor/meteor';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { Sessions } from '../../api/sessions/Sessions';
import { SessionsInterests } from '../../api/sessions/SessionsInterests';
import { ProfilesSessions } from '../../api/profiles/ProfilesSessions';
import { ProfilesParticipation } from '../../api/profiles/ProfilesParticipation';
import { SessionsParticipants } from '../../api/sessions/SessionsParticipants';

/** Define a publication to publish all interests. */
Meteor.publish(Interests.userPublicationName, () => Interests.collection.find());

/** Define a publication to publish all profiles. */
Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesInterests.userPublicationName, () => ProfilesInterests.collection.find());

/** Define a publication to publish all projects. */
Meteor.publish(Sessions.userPublicationName, () => Sessions.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesSessions.userPublicationName, () => ProfilesSessions.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(SessionsInterests.userPublicationName, () => SessionsInterests.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(SessionsParticipants.userPublicationName, () => SessionsParticipants.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesParticipation.userPublicationName, () => ProfilesParticipation.collection.find());

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
