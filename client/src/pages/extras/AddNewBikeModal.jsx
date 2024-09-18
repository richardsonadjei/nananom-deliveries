import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const AddBikeModal = ({ show, handleClose }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [price, setPrice] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [datePurchased, setDatePurchased] = useState('');
  const [supplier, setSupplier] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBike = {
      make,
      model,
      year: Number(year),
      engineSize,
      price: Number(price),
      registrationNumber,
      datePurchased: new Date(datePurchased),
      supplier,
      notes,
    };

    try {
      const response = await fetch('/api/motorbikes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBike),
      });

      if (response.ok) {
        const result = await response.json();
        alert('Bike added successfully!');
        handleClose(); // Close the modal on success
      } else {
        const error = await response.json();
        console.error('Failed to add bike:', error);
        alert('Failed to add bike. Please check your input.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Bike</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Make */}
            <Col md={6}>
              <Form.Group controlId="make">
                <Form.Label>Make</Form.Label>
                <Form.Control
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            {/* Model */}
            <Col md={6}>
              <Form.Group controlId="model">
                <Form.Label>Model</Form.Label>
                <Form.Control
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Year */}
            <Col md={6}>
              <Form.Group controlId="year">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </Form.Group>
            </Col>

            {/* Engine Size */}
            <Col md={6}>
              <Form.Group controlId="engineSize">
                <Form.Label>Engine Size</Form.Label>
                <Form.Control
                  type="text"
                  value={engineSize}
                  onChange={(e) => setEngineSize(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Price */}
            <Col md={6}>
              <Form.Group controlId="price">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  required
                />
              </Form.Group>
            </Col>

            {/* Registration Number */}
            <Col md={6}>
              <Form.Group controlId="registrationNumber">
                <Form.Label>Registration Number</Form.Label>
                <Form.Control
                  type="text"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Date Purchased */}
            <Col md={6}>
              <Form.Group controlId="datePurchased">
                <Form.Label>Date Purchased</Form.Label>
                <Form.Control
                  type="date"
                  value={datePurchased}
                  onChange={(e) => setDatePurchased(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            {/* Supplier */}
            <Col md={6}>
              <Form.Group controlId="supplier">
                <Form.Label>Supplier</Form.Label>
                <Form.Control
                  type="text"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Notes */}
          <Form.Group controlId="notes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Add Bike
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddBikeModal;
