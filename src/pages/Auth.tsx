
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import AuthComponent from '../components/auth/Auth';

const Auth: React.FC = () => {
  return (
    <MobileLayout>
      <AuthComponent />
    </MobileLayout>
  );
};

export default Auth;
