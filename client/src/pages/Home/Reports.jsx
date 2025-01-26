import React from 'react';
import { Card } from 'react-bootstrap';
import { FaListAlt } from 'react-icons/fa';

const Reports = ({ handleShowModal }) => {
  return (
    <div onClick={handleShowModal} style={{ cursor: 'pointer' }}>
      <Card className="custom-card transaction-card">
        <FaListAlt className="icon-large" />
        <Card.Title>Reports</Card.Title>
      </Card>
    </div>
  );
};

export default Reports;
