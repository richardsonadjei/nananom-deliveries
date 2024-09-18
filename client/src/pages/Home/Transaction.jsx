import React from 'react';
import { Card } from 'react-bootstrap';
import { FaListAlt } from 'react-icons/fa';

const TransactionCard = () => {
  return (
    <Card className="custom-card transaction-card">
      <FaListAlt className="icon-large" />
      <Card.Title>Transactions</Card.Title>
    </Card>
  );
};

export default TransactionCard;
