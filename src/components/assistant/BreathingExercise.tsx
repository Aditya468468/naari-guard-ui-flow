import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  name: string;
  pattern: { inhale: number; hold1?: number; exhale: number; hold2?: number };
  totalDuration: number;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ name, pattern, totalDuration }) => {
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(totalDuration);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return totalDuration;
        }
        return prev - 1;
      });

      setPhaseTime((prev) => prev + 1);

      // Cycle through breathing phases
      if (currentPhase === 'inhale' && phaseTime >= pattern.inhale) {
        setCurrentPhase(pattern.hold1 ? 'hold1' : 'exhale');
        setPhaseTime(0);
      } else if (currentPhase === 'hold1' && phaseTime >= (pattern.hold1 || 0)) {
        setCurrentPhase('exhale');
        setPhaseTime(0);
      } else if (currentPhase === 'exhale' && phaseTime >= pattern.exhale) {
        setCurrentPhase(pattern.hold2 ? 'hold2' : 'inhale');
        setPhaseTime(0);
      } else if (currentPhase === 'hold2' && phaseTime >= (pattern.hold2 || 0)) {
        setCurrentPhase('inhale');
        setPhaseTime(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhase, phaseTime, pattern, totalDuration]);

  const handleStart = () => {
    setIsActive(true);
    setTimeRemaining(totalDuration);
    setCurrentPhase('inhale');
    setPhaseTime(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setTimeRemaining(totalDuration);
    setCurrentPhase('inhale');
    setPhaseTime(0);
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
      default: return 'Ready';
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-blue-500 to-cyan-500';
      case 'hold1': return 'from-purple-500 to-pink-500';
      case 'exhale': return 'from-green-500 to-teal-500';
      case 'hold2': return 'from-orange-500 to-yellow-500';
      default: return 'from-naari-purple to-naari-teal';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card p-4 rounded-lg hover:bg-white/5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm font-medium">{name}</p>
        <span className="text-naari-teal text-xs">{formatTime(timeRemaining)}</span>
      </div>

      {isActive && (
        <div className="mb-4 flex flex-col items-center">
          <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getPhaseColor()} flex items-center justify-center mb-2 transition-all duration-1000 ${
            currentPhase === 'inhale' ? 'scale-110' : currentPhase === 'exhale' ? 'scale-90' : 'scale-100'
          }`}>
            <div className="w-28 h-28 rounded-full bg-naari-dark flex items-center justify-center">
              <span className="text-white text-sm font-medium">{getPhaseText()}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            {currentPhase === 'inhale' && `${pattern.inhale - phaseTime}s`}
            {currentPhase === 'hold1' && `${(pattern.hold1 || 0) - phaseTime}s`}
            {currentPhase === 'exhale' && `${pattern.exhale - phaseTime}s`}
            {currentPhase === 'hold2' && `${(pattern.hold2 || 0) - phaseTime}s`}
          </p>
        </div>
      )}

      <div className="flex gap-2">
        {!isActive ? (
          <button
            onClick={handleStart}
            className="flex-1 py-2 px-3 bg-gradient-to-r from-naari-purple to-naari-teal text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:shadow-glow-purple transition-all"
          >
            <Play className="w-4 h-4" />
            Start
          </button>
        ) : (
          <>
            <button
              onClick={handleStop}
              className="flex-1 py-2 px-3 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-500/30 transition-all"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
            <button
              onClick={handleStart}
              className="py-2 px-3 bg-naari-purple/20 text-naari-purple border border-naari-purple/30 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-naari-purple/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;
