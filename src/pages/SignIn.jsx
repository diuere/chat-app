import firebase from 'firebase/app';
import {
  Col,
  Container,
  Grid,
  Button,
  ButtonToolbar,
  Panel,
  Loader,
} from 'rsuite';
import GearIcon from '@rsuite/icons/Gear';
import { useProfile } from '../context/profile-context';
import { signUserIn } from '../helpers/auth';

const SignIn = () => {
  const { profile, isLoading, navigate } = useProfile();

  if (!profile && isLoading) {
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }

  if (profile && !isLoading) {
    return navigate('/');
  }

  const signInWith = service => {
    switch (service) {
      case 'google':
        signUserIn(new firebase.auth.GoogleAuthProvider());
        break;
      default:
        throw new Error('Invalid service: ' + service);
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
            <ButtonToolbar className="mt-3">
              <Button
                block
                appearance="primary"
                color="green"
                onClick={() => signInWith('google')}
              >
                <GearIcon icon="google" /> Continue with Google
              </Button>
            </ButtonToolbar>
          </Panel>
        </Col>
      </Grid>
    </Container>
  );
};

export default SignIn;
