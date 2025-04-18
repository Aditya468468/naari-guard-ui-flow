
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import PassiveListenerComponent from '../components/passive-listener/PassiveListener';

const PassiveListener: React.FC = () => {
  return (
    <MobileLayout>
      <PassiveListenerComponent />
    </MobileLayout>
  );
};

export default PassiveListener;
