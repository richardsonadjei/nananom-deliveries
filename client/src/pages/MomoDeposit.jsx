// MoMoDeposit.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert } from 'reactstrap';

const MoMoDeposit = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    depositAmount: '',
    description: '',
    recordedBy: currentUser ? currentUser.userName : '',
    date: '', // New state for the date
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/record-momo-deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle success or error response from the server
      if (response.ok) {
        setSuccessMessage('MoMo deposit recorded successfully');
        setTimeout(() => {
          setSuccessMessage(null);
          window.location.href = '/';
        }, 3000);
      } else {
        setErrorMessage(`Error: ${data.error}`);
        setTimeout(() => {
          setErrorMessage(null);
          window.location.reload(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Internal Server Error');
      setTimeout(() => {
        setErrorMessage(null);
        window.location.reload(false);
      }, 3000);
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <Container>
      <Row>
        <Col sm="6" className="mx-auto mt-5">
          <h2 className="mb-4 text-center">MoMo Deposit</h2>
          {errorMessage && (
            <Alert color="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
          
          {successMessage && (
            <Alert color="success" className="mt-3">
              {successMessage}
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="depositAmount" style={{ color: 'black', fontWeight: 'bold' }}>Deposit Amount</Label>
              <Input
                type="number"
                name="depositAmount"
                id="depositAmount"
                placeholder="Enter Deposit Amount"
                value={formData.depositAmount}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="description" style={{ color: 'black', fontWeight: 'bold' }}>Description</Label>
              <Input
                type="text"
                name="description"
                id="description"
                placeholder="Enter Description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>

            {/* New Date Input Field */}
            <FormGroup>
              <Label for="date" style={{ color: 'black', fontWeight: 'bold' }}>Date</Label>
              <Input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="recordedBy" style={{ color: 'black', fontWeight: 'bold' }}>Recorded By</Label>
              <Input
                type="text"
                name="recordedBy"
                id="recordedBy"
                value={formData.recordedBy}
                readOnly
              />
            </FormGroup>

            <Button color="primary" type="submit">
              Record MoMo Deposit
            </Button>
          </Form>


         
        </Col>
      </Row>
    </Container>
  );
};

export default MoMoDeposit;
