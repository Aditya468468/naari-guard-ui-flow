
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import RoutePlannerComponent from '../components/routes/RoutePlanner';

const RoutePlanner: React.FC = () => {
  return (
    <MobileLayout>
      <RoutePlannerComponent />
    </MobileLayout>
  );
};

export default RoutePlanner;
