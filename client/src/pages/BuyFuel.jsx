import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert } from 'reactstrap';

const BuyFuel = () => {
  const { currentUser } = useSelector((state) => state.user);

  // State to manage form data
  const [formData, setFormData] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    purchasedBy: currentUser ? currentUser.userName : '',
  });

  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/buy-fuel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle success or error response from the server
      if (response.ok) {
        setSuccessMessage('Fuel purchased successfully');
        setTimeout(() => {
          setSuccessMessage(null);
          window.location.href = '/';
        }, 3000);
      } else {
        setErrorMessage(`Error: ${data.error || 'Unknown error'}`);
        setTimeout(() => {
          setErrorMessage(null);
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Internal Server Error');
      setTimeout(() => {
        setErrorMessage(null);
        window.location.reload();
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
          <h2 className="mb-4 text-center">Buy Fuel Form</h2>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="amount">Amount</Label>
              <Input
                type="number"
                name="amount"
                id="amount"
                placeholder="Enter Amount"
                value={formData.amount}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="date">Date</Label>
              <Input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </FormGroup>

            <FormGroup>
              <Label for="purchasedBy">Purchased By</Label>
              <Input
                type="text"
                name="purchasedBy"
                id="purchasedBy"
                value={formData.purchasedBy}
                readOnly
              />
            </FormGroup>

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

            <Button color="primary" type="submit">
              Buy Fuel
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BuyFuel;
