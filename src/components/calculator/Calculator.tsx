
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [emergencyCode, setEmergencyCode] = useState('9999');
  const [isChecking, setIsChecking] = useState(false);
  const [tempEmergency, setTempEmergency] = useState(false);
  
  const handleButtonPress = (value: string) => {
    // Check if emergency code is entered
    if (display === emergencyCode) {
      setIsChecking(true);
      setTimeout(() => {
        setTempEmergency(true);
        setIsChecking(false);
      }, 1000);
      return;
    }
    
    // Handle calculator logic
    if (value === 'C') {
      setDisplay('0');
    } else if (value === '=') {
      try {
        // Using Function constructor to safely evaluate math expressions
        // eslint-disable-next-line no-new-func
        const result = new Function(`return ${display.replace(/×/g, '*').replace(/÷/g, '/')}`)();
        setDisplay(result.toString());
      } catch (error) {
        setDisplay('Error');
      }
    } else if (value === '±') {
      setDisplay(display.charAt(0) === '-' ? display.substring(1) : '-' + display);
    } else if (value === '%') {
      try {
        const result = parseFloat(display) / 100;
        setDisplay(result.toString());
      } catch (error) {
        setDisplay('Error');
      }
    } else {
      setDisplay(display === '0' || display === 'Error' ? value : display + value);
    }
  };
  
  // Create calculator buttons
  const buttons = [
    'C', '±', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=',
  ];
  
  if (tempEmergency) {
    return (
      <div className="p-4 flex flex-col h-full animate-fade-in">
        <div className="bg-naari-danger p-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-white animate-pulse-soft" />
            <span className="text-white font-medium">Emergency Mode</span>
          </div>
          <button onClick={() => setTempEmergency(false)} className="text-white">
            <span className="text-sm">Close</span>
          </button>
        </div>
        
        <div className="bg-black/80 flex-1 p-4 rounded-b-xl">
          <p className="text-white text-center">
            Emergency mode activated. Silent recording and location sharing enabled.
          </p>
          
          <div className="glass-card rounded-xl p-4 mt-4 text-center">
            <p className="text-xs text-gray-400">
              This is a preview of the emergency mode. In a real scenario, this would activate your safety protocols.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold text-gradient mb-4">Calculator</h1>
      
      <div className={`glass-card rounded-xl p-4 mb-6 transition-all duration-300 ${
        isChecking ? 'border border-naari-danger/50 shadow-glow-danger animate-pulse-soft' : ''
      }`}>
        <div className="text-right">
          <div className="text-gray-400 text-sm h-6">
            {isChecking ? 'Checking input...' : ''}
          </div>
          <div className="text-3xl font-light text-white overflow-x-auto scrollbar-none">
            {display}
          </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-4 gap-3">
        {buttons.map((btn, index) => (
          <button
            key={index}
            className={`${
              ['C', '±', '%', '÷', '×', '-', '+', '='].includes(btn)
                ? 'bg-naari-purple/20 text-naari-purple hover:bg-naari-purple/30'
                : 'bg-white/5 text-white hover:bg-white/10'
            } ${
              btn === '0' ? 'col-span-2' : ''
            } rounded-xl text-xl font-light flex items-center justify-center transition-colors`}
            onClick={() => handleButtonPress(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
      
      {emergencyCode && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            <span className="text-naari-purple">Tip:</span> Enter {emergencyCode} for calculator functions
          </p>
        </div>
      )}
    </div>
  );
};

export default Calculator;
