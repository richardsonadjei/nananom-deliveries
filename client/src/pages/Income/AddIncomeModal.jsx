import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaMotorcycle, FaStickyNote, FaWallet, FaMoneyBill } from 'react-icons/fa';
import Select from 'react-select'; // For searchable dropdown
import { useSelector } from 'react-redux'; // For getting current user

const IncomeModal = ({ show, handleClose }) => {
  const [selectedMotorbike, setSelectedMotorbike] = useState(null); // Motorbike input field
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default to 'Cash'
  const [notes, setNotes] = useState(''); // Notes field
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today's date
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [motorbikes, setMotorbikes] = useState([]); // Motorbikes fetched from the API
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const currentUser = useSelector((state) => state.user.currentUser?.userName || ''); // Get current user

  // Fetch motorbikes from the API
  useEffect(() => {
    const fetchMotorbikes = async () => {
      try {
        const response = await fetch('/api/motorbikes');
        const data = await response.json();

        // Sort motorbikes alphabetically by model and set to state
        const sortedMotorbikes = data.sort((a, b) => a.model.localeCompare(b.model));
        setMotorbikes(
          sortedMotorbikes.map((motorbike) => ({
            label: `${motorbike.registrationNumber}`,
            value: motorbike._id, // Use the motorbike ID
          }))
        );
      } catch (error) {
        console.error('Error fetching motorbikes:', error);
      }
    };

    fetchMotorbikes();
  }, []);

  // Format date for the notes field
  const getFormattedDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: '2-digit' };
    return new Date(date).toLocaleDateString('en-US', options).replace(',', '');
  };

  // Update notes when the date changes
  useEffect(() => {
    setNotes(`Sales made for ${getFormattedDate(date)}`);
  }, [date]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const incomeData = {
      motorbike: selectedMotorbike?.value || '', // Use selected motorbike's ID
      amount,
      category: 'Sales', // Default category set to 'Sales'
      paymentMethod,
      notes,
      date,
      time,
      recordedBy: currentUser, // Include recordedBy field
    };

    try {
      const response = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });

      if (!response.ok) {
        throw new Error('Failed to save income');
      }

      const result = await response.json();
      console.log('Income saved:', result);

      // Show success alert and close modal
      window.alert('Income saved successfully!');

      // Optionally reset form fields
      setSelectedMotorbike(null);
      setAmount('');
      setPaymentMethod('Cash');
      setNotes(`Sales made for ${getFormattedDate(new Date())}`);
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      handleClose(); // Close modal on success
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Record Motorbike Sales Income</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={onSubmit}>
          <Row>
            {/* Motorbike */}
            <Col md={6}>
              <Form.Group controlId="motorbike" className="mt-3">
                <Form.Label>Motorbike</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaMotorcycle />
                  </InputGroup.Text>
                  <Select
                    value={selectedMotorbike}
                    onChange={(selectedOption) => setSelectedMotorbike(selectedOption)}
                    options={motorbikes}
                    isClearable
                    isSearchable
                    placeholder="Select Motorbike"
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Amount */}
            <Col md={6}>
              <Form.Group controlId="amount" className="mt-3">
                <Form.Label className="text-danger">Income Amount</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Category (predefined as Sales and read-only) */}
            <Col md={6}>
              <Form.Group controlId="category" className="mt-3">
                <Form.Label>Category</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaMoneyBill />
                  </InputGroup.Text>
                  <Form.Control type="text" value="Sales" readOnly />
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Payment Method */}
            <Col md={6}>
              <Form.Group controlId="paymentMethod" className="mt-3">
                <Form.Label>Payment Method</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <FaWallet />
                  </InputGroup.Text>
                  <Form.Control
                    as="select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Momo">Momo</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Date */}
            <Col md={6}>
              <Form.Group controlId="date" className="mt-3">
                <Form.Label>Date</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <InputGroup.Text>
                    <FaCalendarAlt />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Time */}
            <Col md={6}>
              <Form.Group controlId="time" className="mt-3">
                <Form.Label>Time</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                  <InputGroup.Text>
                    <FaClock />
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* Recorded By */}
            <Col md={12}>
              <Form.Group controlId="recordedBy" className="mt-3">
                <Form.Label>Recorded By</Form.Label>
                <Form.Control type="text" value={currentUser} readOnly />
              </Form.Group>
            </Col>
          </Row>

          {/* Notes */}
          <Form.Group controlId="notes" className="mt-3">
            <Form.Label>Notes</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaStickyNote />
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
            {loading ? 'Saving...' : 'Save Income'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default IncomeModal;
