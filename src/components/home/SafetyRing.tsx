import React from 'react';

interface SafetyRingProps {
  score: number;
}

const SafetyRing: React.FC<SafetyRingProps> = ({ score }) => {
  // Calculate colors based on score
  const getColor = () => {
    if (score >= 80) return 'text-naari-safe shadow-glow-safe';
    if (score >= 50) return 'text-yellow-500 shadow-glow-yellow';
    return 'text-naari-danger shadow-glow-danger';
  };

  // Calculate percentage for the ring
  const circumference = 2 * Math.PI * 45; // r = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center w-52 h-52 mx-auto">
      {/* Background circle */}
      <svg className="w-full h-full rotate-[-90deg] animate-rotate-safety" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="6"
        />
        {/* Colored progress circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-in-out ${getColor()}`} // Corrected this line
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-white">{score}</span>
        <span className="text-sm text-gray-300">Safety Score</span>
      </div>
      
      {/* Glowing dot at current position */}
      <div 
        className={`absolute w-3 h-3 rounded-full ${getColor()} animate-pulse-soft`} // Corrected this line
        style={{
          top: '50%',
          left: '50%',
          transform: `rotate(${(score / 100) * 360}deg) translate(45px, 0) translate(-50%, -50%)`, // Corrected transform syntax
        }}
      />
    </div>
  );
};

export default SafetyRing;
