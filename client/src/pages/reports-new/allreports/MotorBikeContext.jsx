import React, { createContext, useState, useContext } from 'react';

// Create a Context for Motorbike Selection
const MotorbikeContext = createContext();

// Custom hook to use the MotorbikeContext
export const useMotorbike = () => useContext(MotorbikeContext);

export const MotorbikeProvider = ({ children }) => {
  const [selectedBikeId, setSelectedBikeId] = useState('');

  return (
    <MotorbikeContext.Provider value={{ selectedBikeId, setSelectedBikeId }}>
      {children}
    </MotorbikeContext.Provider>
  );
};
