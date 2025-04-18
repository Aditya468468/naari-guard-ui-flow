import React from 'react';
import SafetyMapComponent from '../../map/SafetyMapComponent'; // Adjust the path based on your file structure

const SafetyMap: React.FC = () => {
  return (
    <div>
      <h1 className="text-center mt-4">Naari Guard Map</h1>
      <SafetyMapComponent />
    </div>
  );
};

export default SafetyMap;
