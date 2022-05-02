import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Label, Button, List, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import SimpleSchema from 'simpl-schema';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import { Profiles } from '../../api/profiles/Profiles';
import { SessionsInterests } from '../../api/sessions/SessionsInterests';
import { Sessions } from '../../api/sessions/Sessions';
import { ProfilesSessions } from '../../api/profiles/ProfilesSessions';
import MultiSelectField from '../forms/controllers/MultiSelectField';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allSessions) => new SimpleSchema({
  sessions: { type: Array, label: 'Sessions', optional: true },
  'sessions.$': { type: String, allowedValues: allSessions },
});

/** Gets the Project data as well as Profiles and Interests associated with the passed Project name. */
function getSessionData(_id) {
  const data = Sessions.collection.findOne({ _id });
  const interests = _.pluck(SessionsInterests.collection.find({ sessionID: _id }).fetch(), 'interest');
  const profiles = _.pluck(ProfilesSessions.collection.find({ sessionID: _id }).fetch(), 'profile');
  const profileName = profiles.map(profile => (`${Profiles.collection.findOne({ email: profile }).firstName
  } ${Profiles.collection.findOne({ email: profile }).lastName}`));
  return _.extend({ }, data, { interests, participants: profileName });
}

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
      <Header as='h5'>Creator</Header>
      {_.map(props.session.participants, (p, index) => <List key={index} size='tiny' style={{ color: 'black' }} >{p}</List>)}
    </Card.Content>
    <Card.Content>
      <Button>
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

  constructor(props) {
    super(props);
    this.state = { sessions: [] };
  }

  submit(data) {
    this.setState({ sessions: data.sessions || [] });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const allSessions = _.pluck(Sessions.collection.find().fetch(), '_id');
    const formSchema = makeSchema(allSessions);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const emails = _.pluck(ProfilesSessions.collection.find({ sessionID: { $in: this.state.sessions } }).fetch(), 'sessionID');
    const sessionData = emails.map(sessionID => getSessionData(sessionID));
    return (
      <div id="parent">
        <Container id="filter-page" style={{ paddingBottom: '35px' }}>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data)} >
            <Segment>
              <MultiSelectField id='sessions' name='sessions' showInlineError={true} placeholder={'Sessions'}/>
              <SubmitField id='submit' value='Submit'/>
            </Segment>
          </AutoForm>
          <Card.Group style={{ paddingTop: '10px' }}>
            {_.map(sessionData, (session, index) => <MakeCard key={index} session={session}/>)}
          </Card.Group>
        </Container>
        <Container id="sessions-page">
          <Card.Group>
            {_.map(sessionData, (session, index) => <MakeCard key={index} session={session}/>)}
          </Card.Group>
        </Container>
      </div>
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
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready(),
  };
})(SessionsPage);
