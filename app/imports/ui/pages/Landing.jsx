import React from 'react';
import { Grid, Header, Reveal, Image } from 'semantic-ui-react';

const font = {
  fontFamily: 'Montserrat',
};
const styles1 = {
  textAlign: 'center',
};
const styles2 = {
  width: '100%',
};

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
  render() {
    return (
      <div id="landing-page" className="parent">
        <div className="header-background">
          <Grid verticalAlign='middle' textAlign='center' container>
            <Grid.Column>
              <Header style={{ paddingTop: '110px', color: 'white', fontSize: '45pt', fontFamily: 'Montserrat' }} as='h1'>
                Fitness Finder
              </Header>
              <Header style={{ paddingBottom: '70px', color: 'white', fontSize: '25pt', fontFamily: 'Montserrat' }} as='h3'>
                Your fitness journey starts here!
              </Header>
            </Grid.Column>
          </Grid>
        </div>
        <div className="middle-background">
          <Grid container centered stackable columns={3}>
            <Grid.Column textAlign='center'>
              <Header style={font} as="h2" inverted>Stay Healthy</Header>
              <div style={styles1}>
                <Reveal animated="fade">
                  <Reveal.Content visible style={styles2}>
                    <Image
                      src="https://static01.nyt.com/images/2022/01/03/realestate/04fix1/oakImage-1641226833782-mediumSquareAt3X.jpg"
                      size="large"
                      centered
                    />
                  </Reveal.Content>
                  <Reveal.Content hidden style={styles2}>
                    <Image
                      src="images/fact1.png"
                      size="large"
                      centered
                    />
                  </Reveal.Content>
                </Reveal>
              </div>
            </Grid.Column>

            <Grid.Column textAlign='center'>
              <Header style={font} as="h2" inverted>Make Friends</Header>
              <div style={styles1}>
                <Reveal animated="fade">
                  <Reveal.Content visible style={styles2}>
                    <Image
                      src="https://static01.nyt.com/images/2021/06/07/us/07xp-polo/07xp-polo-mediumSquareAt3X.jpg"
                      size="large"
                      centered
                    />
                  </Reveal.Content>
                  <Reveal.Content hidden style={styles2}>
                    <Image
                      src="images/fact2.png"
                      size="large"
                      centered
                    />
                  </Reveal.Content>
                </Reveal>
              </div>
            </Grid.Column>

            <Grid.Column textAlign='center'>
              <Header style={font} as="h2" inverted>Explore Interests</Header>
              <div style={styles1}>
                <Reveal animated="fade">
                  <Reveal.Content visible style={styles2}>
                    <Image
                      src="https://www.adventure-journal.com/wp-content/uploads/2014/03/MorganMaassen_Instagram_2.jpg"
                      size="large"
                      centered
                    />
                  </Reveal.Content>
                  <Reveal.Content hidden style={styles2}>
                    <Image
                      src="images/fact3.png"
                      alt="Pls help"
                      size="large"
                      centered
                    />
                  </Reveal.Content>
                </Reveal>
              </div>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Landing;
