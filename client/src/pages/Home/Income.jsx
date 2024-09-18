import React from 'react';
import { Card } from 'react-bootstrap';
import { FaPlusCircle } from 'react-icons/fa';

const IncomeCard = ({ handleShow }) => {
  return (
    <Card className="custom-card add-income-card" onClick={handleShow} style={{ cursor: 'pointer' }}>
      <FaPlusCircle className="icon-large" />
      <Card.Title>Add Income</Card.Title>
    </Card>
  );
};

export default IncomeCard;
