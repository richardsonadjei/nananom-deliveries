import React from 'react';
import { Card } from 'react-bootstrap';
import { FaMinusCircle } from 'react-icons/fa';

const ExpenseCard = ({ handleShow }) => {
  return (
    <Card className="custom-card add-expense-card" onClick={handleShow} style={{ cursor: 'pointer' }}>
      <FaMinusCircle className="icon-large" />
      <Card.Title>Expenditures</Card.Title>
    </Card>
  );
};

export default ExpenseCard;
