
import React from 'react';
import MobileLayout from '../components/layout/MobileLayout';
import CalculatorComponent from '../components/calculator/Calculator';

const Calculator: React.FC = () => {
  return (
    <MobileLayout>
      <CalculatorComponent />
    </MobileLayout>
  );
};

export default Calculator;
