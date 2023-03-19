import React from 'react'
import { Navigate } from 'react-router-dom';

const SignIn = () => {
  const profile = false;

  if (profile) return <Navigate to="/" replace={true} />;

  return (
    <div>SignIn</div>
  )
}

export default SignIn