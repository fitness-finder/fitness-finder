import React from 'react';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Container, Loader, Card, Image, Label, Header, Segment } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { AutoForm, SubmitField } from 'uniforms-semantic';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { ProfilesSessions } from '../../api/profiles/ProfilesSessions';
import { ProfilesParticipation } from '../../api/profiles/ProfilesParticipation';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  interests: { type: Array, label: 'Interests', optional: true },
  'interests.$': { type: String, allowedValues: allInterests },
});

function getProfileData(email) {
  const data = Profiles.collection.findOne({ email });
  const interests = _.pluck(ProfilesInterests.collection.find({ profile: email }).fetch(), 'interest');
  const sessions = _.pluck(ProfilesSessions.collection.find({ profile: email }).fetch(), 'session');
  const participation = _.pluck(ProfilesParticipation.collection.find({ profile: email }).fetch(), 'session');
  // console.log(_.extend({ }, data, { interests, projects: projectPictures }));
  return _.extend({}, data, { interests, sessions, participation });
}

/** Component for layout out a Profile Card. */
const MakeCard = (props) => (
  <Card>
    <Card.Content>
      <Image floated='right' size='mini' src={props.profile.picture}/>
      <Card.Header>{props.profile.firstName} {props.profile.lastName}</Card.Header>
      <Card.Meta>
        <span className='date'>{props.profile.year}</span>
      </Card.Meta>
      <Card.Description>
        {props.profile.bio}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Interests</Header>
      {_.map(props.profile.interests,
        (interest, index) => <Label key={index} size='tiny' color='teal'>{interest}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Sessions</Header>
      {_.map(props.profile.sessions, (session, index) => <Label key={index} size='tiny' color='teal'>{session}</Label>)}
    </Card.Content>
    <Card.Content extra>
      <Header as='h5'>Joined Sessions</Header>
      {_.map(props.profile.participation, (session, index) => <Label key={index} size='tiny' color='teal'>{session}</Label>)}
    </Card.Content>
  </Card>
);

/** Properties */
MakeCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Renders the Profile Collection as a set of Cards. */
class ProfilesPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = { interests: [] };
  }

  submit(data) {
    this.setState({ interests: data.interests || [] });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const allInterests = _.pluck(Interests.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allInterests);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const emails = _.pluck(ProfilesInterests.collection.find({ interest: { $in: this.state.interests } }).fetch(), 'profile');
    const emailsall = _.pluck(Profiles.collection.find().fetch(), 'email');
    const profileDataAll = emailsall.map(email => getProfileData(email));
    const profileData = _.uniq(emails).map(email => getProfileData(email));
    return (

      <div id="profiles-page">
        <Container style={{ paddingBottom: '35px' }}>
          <AutoForm schema={bridge} onSubmit={data => this.submit(data)} >
            <Segment>
              <MultiSelectField id='interests' name='interests' showInlineError={true} placeholder={'Interests'}/>
              <SubmitField id='submit' value='Submit'/>
            </Segment>
          </AutoForm>
          <Card.Group style={{ paddingTop: '10px' }}>
            {_.map(profileData, (profile, index) => {
              if (profile.firstName) {
                return <MakeCard key={index} profile={profile}/>;
              }
              return null;
            })}
          </Card.Group>
        </Container>
        <div style={{ background: '#024731', paddingTop: '20px', paddingBottom: '20px' }}>
          <Header as="h1" textAlign='center' inverted>All Profiles</Header>
          <Container id="profiles-page">
            <Card.Group style={{ paddingTop: '10px' }}>
              {_.map(profileDataAll, (profile, index) => {
                if (profile.firstName) {
                  return <MakeCard key={index} profile={profile}/>;
                }
                return null;
              })}
            </Card.Group>
          </Container>
        </div>
      </div>

    );
  }
}

/** Require an array of Stuff documents in the props. */
ProfilesPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesInterests.userPublicationName);
  const sub3 = Meteor.subscribe(ProfilesSessions.userPublicationName);
  const sub4 = Meteor.subscribe(ProfilesParticipation.userPublicationName);
  const sub5 = Meteor.subscribe(Interests.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && sub5.ready(),
  };
})(ProfilesPage);
