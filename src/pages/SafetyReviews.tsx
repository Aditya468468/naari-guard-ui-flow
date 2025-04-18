
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import SafetyReviewsComponent from '../components/reviews/SafetyReviews';

const SafetyReviews: React.FC = () => {
  return (
    <MobileLayout>
      <SafetyReviewsComponent />
    </MobileLayout>
  );
};

export default SafetyReviews;
