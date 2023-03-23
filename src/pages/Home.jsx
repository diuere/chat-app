import { Container, Loader } from 'rsuite';
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

  return <div>Home</div>;
};

export default Home;
