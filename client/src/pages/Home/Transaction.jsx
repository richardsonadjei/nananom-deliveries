import React from 'react';
import { Card } from 'react-bootstrap';
import { FaListAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TransactionCard = () => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleCardClick = () => {
    navigate('/reports');
  };

  return (
    <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <Card className="custom-card transaction-card">
        <FaListAlt className="icon-large" />
        <Card.Title>Reports</Card.Title>
      </Card>
    </div>
  );
};

export default TransactionCard;
