import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, TextField, LongTextField, SubmitField, ErrorsField } from 'uniforms-semantic';
import swal from 'sweetalert';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import MultiSelectField from '../forms/controllers/MultiSelectField';
import { addSessionMethod } from '../../startup/both/Methods';
import { Interests } from '../../api/interests/Interests';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import RadioField from '../forms/controllers/RadioField';

/** Create a schema to specify the structure of the data to appear in the form. */
const makeSchema = (allInterests) => new SimpleSchema({
  owner: { type: String, label: 'Email', optional: false },
  title: String,
  description: String,
  location: String,
  date: String,
  interests: { type: Array, label: 'Interests', optional: false },
  'interests.$': { type: String, allowedValues: allInterests },
  skillLevel: { type: Array, label: 'Skill Level', optional: true },
  'skillLevel.$': { type: String, allowedValues: ['Beginner', 'Intermediate', 'Advanced'] },
});

/** Renders the Page for adding a document. */
class AddSession extends React.Component {

  /** On submit, insert the data. */
  submit(data, formRef) {
    Meteor.call(addSessionMethod, data, (error) => {
      if (error) {
        swal('Error', error.message, 'error');
      } else {
        swal('Success', 'Session added successfully', 'success').then(() => formRef.reset());
      }
    });
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  render() {
    let fRef = null;
    const allInterests = _.pluck(Interests.collection.find().fetch(), 'name');
    const formSchema = makeSchema(allInterests);
    const bridge = new SimpleSchema2Bridge(formSchema);
    const model = { owner: Meteor.user().username };
    return (
      <Grid id="add-session-page" container centered>
        <Grid.Column>
          <Header as="h2" textAlign="center">Add Session</Header>
          <AutoForm ref={ref => { fRef = ref; }} model ={model} schema={bridge} onSubmit={data => this.submit(data, fRef)}>
            <Segment>
              <Form.Group widths={'equal'}>
                <TextField id='title' name='title' showInlineError={true} placeholder='Session Title'/>
                <TextField id='owner' name='owner' showInlineError={true} placeholder={'email'} disabled/>
                <TextField id='location' name='location' showInlineError={true} placeholder='Location'/>
                <TextField id='date' name='date' showInlineError={true} placeholder='Date'/>
              </Form.Group>
              <LongTextField id='description' name='description' placeholder='Describe the session here'/>
              <Form.Group widths={'equal'}>
                <MultiSelectField id='interests' name='interests' showInlineError={true} placeholder={'Interests'}/>
                <RadioField id='skillLevel' name='skillLevel' inline='true' showInlineError={true} placeholder={'Skill Level'}/>
              </Form.Group>
              <SubmitField id='submit' value='Submit'/>
              <ErrorsField/>
            </Segment>
          </AutoForm>
        </Grid.Column>
      </Grid>
    );
  }
}

AddSession.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Interests.userPublicationName);
  const sub2 = Meteor.subscribe(Profiles.userPublicationName);
  const sub3 = Meteor.subscribe(ProfilesInterests.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready(),
  };
})(AddSession);
