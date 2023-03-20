import firebase from 'firebase/app';
import { auth, database } from '../misc/firebase';
import { Button, Col, Container, Grid, Icon, Panel, Alert } from 'rsuite';

const SignIn = () => {
  const signIn = async (provider) => {
    try {
      const { additionalUserInfo, user } = await auth.signInWithPopup(provider);

      if (additionalUserInfo.isNewUser) {
        await database.ref(`/profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
        });
      }

      Alert.success('Signed in', 4000);
    } catch (err) {
      Alert.error(err.message, 4000);
    }
  }

  const signInWith = service => {
    switch (service) {
      case 'google':
        signIn(new firebase.auth.GoogleAuthProvider());
        break;
      default:
        return new Error('Invalid service: ' + service);
    }
  };

  return (
    <Container>
      <Grid className="mt-page">
        <Col xs={24} md={12} mdOffset={6}>
          <Panel>
            <div className="text-center">
              <h2>Welcome to Chat</h2>
              <p>Progressive chat platform neophytes</p>
            </div>
            <div className='mt-3'>
              <Button block color="green" onClick={signInWith('google')}>
                <Icon icon="google" /> Continue with Google
              </Button>
            </div>
          </Panel>
        </Col>
      </Grid>
    </Container>
  );
};

export default SignIn;
