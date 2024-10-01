import React, { useState, useEffect } from 'react';
import { Form, FormGroup, Label, Input, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';

const RegisterEmployeeModal = ({ isOpen, toggle }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    position: 'Biker',
    hireDate: '',
    salary: ''
  });

  const [positions, setPositions] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch positions from API
    const fetchPositions = async () => {
      try {
        const response = await fetch('/api/positions');
        if (!response.ok) {
          throw new Error('Failed to fetch positions');
        }
        const data = await response.json();
        const sortedPositions = data.sort((a, b) => a.title.localeCompare(b.title));
        setPositions(sortedPositions);
      } catch (error) {
        console.error('Error fetching positions:', error.message);
      }
    };

    fetchPositions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePositionChange = (selectedOption) => {
    setFormData({ ...formData, position: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to register employee');
      }

      setSuccessMessage('Employee registered successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        toggle(); // Close the modal
      }, 1000);
    } catch (error) {
      console.error('Error registering employee:', error.message);
      setErrorMessage('Failed to register employee');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000); // Clear error message after 3 seconds
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Register New Employee</ModalHeader>
      <ModalBody>
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="dateOfBirth">Date of Birth</Label>
                <Input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phoneNumber">Phone Number</Label>
                <Input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="position">Position</Label>
                <Select
                  id="position"
                  name="position"
                  value={positions.find(pos => pos.value === formData.position) || { value: 'Biker', label: 'Biker' }}
                  onChange={handlePositionChange}
                  options={positions.map(pos => ({ value: pos.title, label: pos.title }))}
                  placeholder="Select position..."
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="hireDate">Hire Date</Label>
                <Input
                  type="date"
                  id="hireDate"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="salary">Salary</Label>
                <Input
                  type="text"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
            </Col>
          </Row>
          <ModalFooter>
            <Button color="primary" type="submit">Register Employee</Button>
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default RegisterEmployeeModal;
