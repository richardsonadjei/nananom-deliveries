import React, { useState, useEffect } from 'react';

const BikeSelector = ({ onSelectBike }) => {
  const [bikes, setBikes] = useState([]);
  
  // Fetch available bikes
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch('/api/motorbikes');
        const data = await response.json();
        setBikes(data);
      } catch (error) {
        console.error('Error fetching bikes:', error);
      }
    };
    fetchBikes();
  }, []);

  return (
    <div>
      <h5>Select Motorbike</h5>
      <select onChange={(e) => onSelectBike(e.target.value)}>
        <option value="">Select a bike</option>
        {bikes.map((bike) => (
          <option key={bike._id} value={bike._id}>
            {bike.registrationNumber}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BikeSelector;
