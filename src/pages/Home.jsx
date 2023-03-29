import { Outlet, useMatch } from 'react-router-dom';
import { Col, Container, Grid, Loader, Row } from 'rsuite';
import Sidebar from '../components/Sidebar';
import { useProfile } from '../context/profile-context';
import { RoomsContextProvider } from '../context/rooms-context';
import { useMediaQuery } from '../helpers/custom-hooks';

const Home = () => {
  const { profile, isLoading, navigate } = useProfile();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const match = useMatch('/');

  const isExact = match && match.pathname === '/'; // checking if the home page is being displayed

  const canRenderSidebar = !isMobile || isExact; // shall be used to determine if the sidebar should appear or not

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
    <RoomsContextProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          {canRenderSidebar && (
            <Col xs={24} md={8} className="h-100">
              <Sidebar />
            </Col>
          )}
          <Col xs={24} md={16} className="h-100">
            {!isMobile && isExact ? (
              <h6 className="text-center mt-page">Please select chat</h6>
            ) : (
              <Outlet />
            )}
          </Col>
        </Row>
      </Grid>
    </RoomsContextProvider>
  );
};

export default Home;
