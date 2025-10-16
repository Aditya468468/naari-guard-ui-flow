import React, { createContext, useContext, useState, useEffect } from 'react';

interface InvisibleModeContextType {
  isInvisibleMode: boolean;
  activateInvisibleMode: () => void;
  deactivateInvisibleMode: () => void;
}

const InvisibleModeContext = createContext<InvisibleModeContextType | undefined>(undefined);

export const InvisibleModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInvisibleMode, setIsInvisibleMode] = useState(() => {
    const stored = localStorage.getItem('invisibleMode');
    return stored === 'true';
  });

  useEffect(() => {
    localStorage.setItem('invisibleMode', isInvisibleMode.toString());
  }, [isInvisibleMode]);

  const activateInvisibleMode = () => setIsInvisibleMode(true);
  const deactivateInvisibleMode = () => setIsInvisibleMode(false);

  return (
    <InvisibleModeContext.Provider value={{ isInvisibleMode, activateInvisibleMode, deactivateInvisibleMode }}>
      {children}
    </InvisibleModeContext.Provider>
  );
};

export const useInvisibleMode = () => {
  const context = useContext(InvisibleModeContext);
  if (!context) {
    throw new Error('useInvisibleMode must be used within InvisibleModeProvider');
  }
  return context;
};
