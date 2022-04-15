import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image, Label, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Sessions } from '../../api/sessions/Sessions';
import { SessionsInterests } from '../../api/sessions/SessionsInterests';
import { SessionsParticipants } from '../../api/sessions/SessionsParticipants';

/** Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getProjectData(name) {
  const data = Sessions.collection.findOne({ name });
  const interests = _.pluck(SessionsInterests.collection.find({ project: name }).fetch(), 'interest');
  const participants = _.pluck(SessionsParticipants.collection.find({ project: name }).fetch(), 'participants');
  const profiles = _.pluck(ProfilesProjects.collection.find({ project: name }).fetch(), 'profile');
  const profilePictures = profiles.map(profile => Profiles.collection.findOne({ email: profile }).picture);
  return _.extend({ }, data, participants, { interests, participants: profilePictures });
}

/** Component for layout out a Session Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Card.Header style={{ marginTop: '0px' }}>{props.session.name}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.session.title}</span>
      </Card.Meta>
      <Card.Description>
        {props.session.description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      {_.map(props.session.interests,
        (interest, index) => <Label key={index} size='tiny' color='teal'>{interest}</Label>)}
    </Card.Content>
    <Card.Content extra>
      {_.map(props.session.participants, (p, index) => <Image key={index} circular size='mini' src={p}/>)}
    </Card.Content>
    <Card.Content extra>
      <Button class='ui button'>
        Join Session
      </Button>
    </Card.Content>
  </Card>
);

MakeCard.propTypes = {
  session: PropTypes.object.isRequired,
};

/** Renders the Project Collection as a set of Cards. */
class SessionsPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const sessions = _.pluck(Sessions.collection.find().fetch(), 'name');
    const sessionData = sessions.map(project => getProjectData(project));
    return (
      <Container id="projects-page">
        <Card.Group>
          {_.map(sessionData, (session, index) => <MakeCard key={index} session={session}/>)}
        </Card.Group>
      </Container>
    );
  }
}

SessionsPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(ProfilesProjects.userPublicationName);
  const sub2 = Meteor.subscribe(Sessions.userPublicationName);
  const sub3 = Meteor.subscribe(SessionsInterests.userPublicationName);
  const sub4 = Meteor.subscribe(Profiles.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(SessionsPage);
