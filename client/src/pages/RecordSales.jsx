import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert } from 'reactstrap';


const RecordSales = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    salesAmount: '',
    recordedBy: currentUser ? currentUser.userName : '',
    date: '',
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/create-sales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle success or error response from the server
      if (response.ok) {
        setSuccessMessage('Daily sale recorded successfully');
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
          <h2 className="mb-4 text-center">Record Sales</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="salesAmount" style={{ color: 'black', fontWeight: 'bold' }}>Sales Amount</Label>
              <Input
                type="number"
                name="salesAmount"
                id="salesAmount"
                placeholder="Enter Sales Amount"
                value={formData.salesAmount}
                onChange={handleInputChange}
              />
            </FormGroup>

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
              Record Sale
            </Button>
          </Form>

          {successMessage && (
            <Alert color="success" className="mt-3">
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert color="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default RecordSales;
