
import React from 'react';
import SafetyMapComponent from '../map/SafetyMapComponent'; // Correct relative path

const SafetyMap: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-center mt-4 text-3xl font-semibold text-gray-800">Naari Guard Map</h1>
      <SafetyMapComponent />
    </div>
  );
};

export default SafetyMap;
