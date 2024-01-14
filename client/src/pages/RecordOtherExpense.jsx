import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert } from 'reactstrap';

const RecordOtherExpense = () => {
  const { currentUser } = useSelector((state) => state.user);

  // State to manage form data
  const [formData, setFormData] = useState({
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    purchasedBy: currentUser ? currentUser.userName : '',
    description: '',
  });

  // State for success and error messages
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/add-other-expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // Handle success or error response from the server
      if (response.ok) {
        setSuccessMessage('Other expense recorded successfully');
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
          <h2 className="mb-4 text-center">Record Other Expense</h2>
          
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

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="amount" style={{ color: 'black', fontWeight: 'bold' }}>Amount</Label>
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
              <Label for="description" style={{ color: 'black', fontWeight: 'bold' }}>Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                placeholder="Enter Other Expense Description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="purchasedBy" style={{ color: 'black', fontWeight: 'bold' }}>Purchased By</Label>
              <Input
                type="text"
                name="purchasedBy"
                id="purchasedBy"
                value={formData.purchasedBy}
                readOnly
              />
            </FormGroup>

            <Button color="primary" type="submit">
              Record Other Expense
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RecordOtherExpense;
