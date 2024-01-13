import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Alert, Spinner } from 'reactstrap';


const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephoneNumber: '',
    ghanaCardNumber: '',
    witnessName: '',
    witnessContact: '',
    role: 'employee',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch logic here (replace with your actual API endpoint)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success case
        setSuccessMessage('User registered successfully!');
        setErrors([]);
        setTimeout(() => {
          setSuccessMessage('');
          // Navigate to / after 3 seconds
          window.location.href = '/signin';
        }, 3000);
      } else {
        // Error case
        const data = await response.json();
        setErrors(data.error ? [data.error] : ['An error occurred. Please try again.']);
        setTimeout(() => {
          setErrors([]);
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Form onSubmit={handleSubmit} className="form-signup">
            <h2 className="text-center mb-4">Sign Up</h2>

            {errors.length > 0 && <Alert color="danger">{errors[0]}</Alert>}

            {successMessage && <Alert color="success">{successMessage}</Alert>}

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="userName">Username</Label>
                  <Input
                    type="text"
                    name="userName"
                    id="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required />
                </FormGroup>
              </Col>
              <Col md={6}>
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
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="confirmPassword">Confirm Password</Label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="telephoneNumber">Telephone Number</Label>
                  <Input
                    type="tel"
                    name="telephoneNumber"
                    id="telephoneNumber"
                    value={formData.telephoneNumber}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="ghanaCardNumber">Ghana Card Number</Label>
                  <Input
                    type="text"
                    name="ghanaCardNumber"
                    id="ghanaCardNumber"
                    value={formData.ghanaCardNumber}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="witnessName">Witness Name</Label>
                  <Input
                    type="text"
                    name="witnessName"
                    id="witnessName"
                    value={formData.witnessName}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="witnessContact">Witness Contact</Label>
                  <Input
                    type="tel"
                    name="witnessContact"
                    id="witnessContact"
                    value={formData.witnessContact}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="role">Role</Label>
                  <Input type="select" name="role" id="role" value={formData.role} onChange={handleChange}>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="ceo">CEO</option>
                  </Input>
                </FormGroup>
              </Col>
            </Row>

            <Button type="submit" color="primary" className="mt-4">
              {loading ? <Spinner size="sm" color="light" /> : 'Sign Up'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUp;
