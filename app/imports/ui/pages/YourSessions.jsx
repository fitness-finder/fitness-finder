import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Label, Button, List, Header } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import swal from 'sweetalert';
import { Profiles } from '../../api/profiles/Profiles';
import { SessionsInterests } from '../../api/sessions/SessionsInterests';
import { Sessions } from '../../api/sessions/Sessions';
import { ProfilesSessions } from '../../api/profiles/ProfilesSessions';
import { deleteSessionMethod, unJoinSessionMethod } from '../../startup/both/Methods';
import { ProfilesParticipation } from '../../api/profiles/ProfilesParticipation';

/** Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getSessionData(value) {
  const data = Sessions.collection.findOne({ _id: value });
  const profiles = (ProfilesSessions.collection.findOne({ sessionID: value }).profile);
  const sessionsParticipants = _.pluck(ProfilesParticipation.collection.find({ sessionID: value }).fetch(), 'profile');
  const profileName = Profiles.collection.findOne({ email: profiles });
  const participants = sessionsParticipants.map(profile => (`${Profiles.collection.findOne({ email: profile }).firstName
  } ${Profiles.collection.findOne({ email: profile }).lastName}`));
  const interests = _.pluck(SessionsInterests.collection.find({ sessionID: value }).fetch(), 'interest');
  return _.extend({ }, data, { interests, creator: profileName, participants, value, profiles });
}

const handleClick = value => () => (

  Meteor.call(deleteSessionMethod, { sessionID: value }, (error) => {
    if (error) {
      swal('Error', error.message, 'error');
    } else {
      swal({ title: 'Success', text: 'Deleted session successfully', icon: 'success' }).then(function () {
        this.window.location.reload();
      });

    }
  })
);

const handleClick2 = value => () => (

  Meteor.call(unJoinSessionMethod, { sessionID: value, email: Meteor.user().username }, (error) => {
    if (error) {
      swal('Error', error.message, 'error');
    } else {
      swal({ title: 'Success', text: 'Un-joined session successfully', icon: 'success' }).then(function () {
        this.window.location.reload();
      });

    }
  })
);

/** Component for layout out a Project Card. */
const MakeCard = (props) => (

  <Card>
    <Card.Content>
      <Card.Header style={{ marginTop: '0px' }}>{props.session.title}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.session.date}</span>
      </Card.Meta>
      <Card.Description>
        {props.session.description}
      </Card.Description>
      <Card.Content extra style={{ color: 'black' }}>
        {props.session.skillLevel}
      </Card.Content>
    </Card.Content>
    <Card.Content extra>
      {_.map(props.session.interests,
        (interest, index) => <Label key={index} size='tiny' color='teal'>{interest}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>{`Creator: ${props.session.creator.firstName} ${props.session.creator.lastName}`}</Header>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Participants</Header>
      {_.map(props.session.participants, (p, index) => <List key={index} size='small' style={{ color: 'black' }} >{p}</List>)}
    </Card.Content>
    {(Meteor.user().username === props.session.profiles) ? (
      <Button onClick={handleClick(props.session.value)}>
        Delete Session
      </Button>
    ) : <Button onClick={handleClick2(props.session.value)}>
      Un-join Session
    </Button>
    }
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
    const sessions = _.pluck(ProfilesSessions.collection.find({ profile: Meteor.user().username }).fetch(), 'sessionID');
    const sessions1 = _.pluck(ProfilesParticipation.collection.find().fetch(), 'sessionID');
    const sessionData = sessions.map(sessionID => getSessionData(sessionID));
    const sessionData1 = sessions1.map(sessionID => getSessionData(sessionID));
    return (
      <Container id="your-sessions-page">
        <Header as='h2'>Created Sessions</Header>
        <Card.Group>
          {_.map(sessionData, (session, index) => <MakeCard key={index} session={session}/>)}
        </Card.Group>
        <Header as='h2'>Joined Sessions</Header>
        <Card.Group>
          {_.map(sessionData1, (session, index) => <MakeCard key={index} session={session}/>)}
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
  const sub1 = Meteor.subscribe(ProfilesSessions.userPublicationName);
  const sub2 = Meteor.subscribe(Sessions.userPublicationName);
  const sub3 = Meteor.subscribe(SessionsInterests.userPublicationName);
  const sub4 = Meteor.subscribe(Profiles.userPublicationName);
  const sub5 = Meteor.subscribe(ProfilesParticipation.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(SessionsPage);
