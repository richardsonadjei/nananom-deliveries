import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert } from 'reactstrap';

const SignIn = () => {
  const [formData, setFormData] = useState({
    userNameOrEmail: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Add this line

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch logic here (replace with your actual API endpoint)
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success case
        const data = await response.json();
        // Display success alert for 3 seconds
        setError('');
        setSuccessMessage('User signed in successfully!');
        setTimeout(() => {
          setSuccessMessage('');
          // Redirect to / after successful sign-in
          window.location.href = '/';
        }, 3000);
      } else {
        // Error case
        const data = await response.json();
        setError(data.error || 'An error occurred. Please try again.');
        // Clear input fields after 3 seconds and refresh the page
        setTimeout(() => {
          setError('');
          setFormData({
            userNameOrEmail: '',
            password: '',
          });
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit} className="form-signin">
            <h2 className="text-center mb-4">Sign In</h2>

            {error && <Alert color="danger">{error}</Alert>}
            {successMessage && <Alert color="success">{successMessage}</Alert>} {/* Add this line */}

            <FormGroup>
              <Label for="userNameOrEmail">Username or Email</Label>
              <Input
                type="text"
                name="userNameOrEmail"
                id="userNameOrEmail"
                value={formData.userNameOrEmail}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <Button type="submit" color="primary" className="mt-4">
              Sign In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;
