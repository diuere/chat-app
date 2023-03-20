import { Navigate } from 'react-router-dom';

const Home = () => {
  const profile = false;

  if (!profile) return <Navigate to="/sign-in" replace={true} />

  return (
    <div>Home</div>
  )
}

export default Home