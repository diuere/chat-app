import { Col, Container, Grid, Loader, Row } from 'rsuite';
import Sidebar from '../components/Sidebar';
import { useProfile } from '../context/profile-context';

const Home = () => {
  const { profile, isLoading, navigate } = useProfile();

  if (!profile && isLoading) {
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }

  if (!profile && !isLoading) {
    return navigate('/sign-in');
  }

  return (
    <Grid fluid className='h-100'>
      <Row>
        <Col xs={24} md={8} >
          <Sidebar />
        </Col>
      </Row>
    </Grid>
  );
};

export default Home;
