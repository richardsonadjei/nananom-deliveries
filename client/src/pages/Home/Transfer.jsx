import React from 'react';
import { Card } from 'react-bootstrap';
import { FaExchangeAlt } from 'react-icons/fa';

const TransferCard = ({ handleShow }) => {
  return (
    <Card className="custom-card transfer-card" onClick={handleShow} style={{ cursor: 'pointer' }}>
      <FaExchangeAlt className="icon-large" />
      <Card.Title>Transfer</Card.Title>
    </Card>
  );
};

export default TransferCard;
