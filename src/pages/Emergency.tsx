
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import SOSTrigger from '../components/emergency/SOSTrigger';

const Emergency: React.FC = () => {
  return (
    <MobileLayout>
      <SOSTrigger />
    </MobileLayout>
  );
};

export default Emergency;
