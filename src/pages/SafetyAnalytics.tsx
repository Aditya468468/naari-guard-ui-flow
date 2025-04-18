
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import SafetyAnalyticsComponent from '../components/analytics/SafetyAnalytics';

const SafetyAnalytics: React.FC = () => {
  return (
    <MobileLayout>
      <SafetyAnalyticsComponent />
    </MobileLayout>
  );
};

export default SafetyAnalytics;
