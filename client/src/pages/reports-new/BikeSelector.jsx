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

  const containerStyle = {
    padding: '16px',
    backgroundColor: '#2d3748',
    borderRadius: '8px',
    color: 'white',
    textAlign: 'center',
    maxWidth: '300px',
    margin: '20px auto',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle = {
    fontSize: '1.25rem',
    color: 'white', // Makes <h5> white
    marginBottom: '16px',
  };

  const selectStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #4A5568',
    fontSize: '1rem',
    width: '100%',
    transition: 'border-color 0.3s ease',
    backgroundColor: '#1A202C',
    color: 'white',
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1rem',
    color: 'white',
    backgroundColor: '#4A5568',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#2d3748',
    transform: 'scale(1.05)',
  };

  // Add button hover effect using state
  const [hover, setHover] = useState(false);

  return (
    <div style={containerStyle}>
      <h5 style={headerStyle}>Select Motorbike</h5>
      <select
        style={selectStyle}
        onChange={(e) =>
          onSelectBike(bikes.find((bike) => bike._id === e.target.value))
        }
      >
        <option value="">Select a bike</option>
        {bikes.map((bike) => (
          <option key={bike._id} value={bike._id}>
            {bike.registrationNumber}
          </option>
        ))}
      </select>
      <button
        style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default BikeSelector;
