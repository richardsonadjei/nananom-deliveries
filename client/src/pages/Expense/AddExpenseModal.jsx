import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaMotorcycle, FaStickyNote, FaWallet, FaMoneyBill } from 'react-icons/fa';
import NewExpenseCategoryModal from '../finance/expensecategory';
import Select from 'react-select';
import { useSelector } from 'react-redux';

const ExpenseModal = ({ show, handleClose }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [categories, setCategories] = useState([]);
  const [motorbikes, setMotorbikes] = useState([]);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.user.currentUser?.userName || '');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/expense-categories');
        const data = await response.json();
        const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(
          sortedCategories.map((category) => ({
            label: category.name,
            value: category._id,
          }))
        );
      } catch (error) {
        console.error('Error fetching expense categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMotorbikes = async () => {
      try {
        const response = await fetch('/api/motorbikes');
        const data = await response.json();
        const sortedMotorbikes = data.sort((a, b) => String(a.model).localeCompare(String(b.model)));
        setMotorbikes(
          sortedMotorbikes.map((motorbike) => ({
            label: `${motorbike.model} - ${motorbike.registrationNumber}`,
            value: motorbike._id,
          }))
        );
      } catch (error) {
        console.error('Error fetching motorbikes:', error);
      }
    };

    fetchMotorbikes();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const expenseData = {
      amount,
      category: category?.value || '',
      motorbike: selectedMotorbike?.value || '',
      paymentMethod,
      notes,
      date,
      time,
      recordedBy: currentUser,
    };

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error('Failed to save expense');
      }

      const result = await response.json();
      
      window.alert('Expense saved successfully!');

      setAmount('');
      setCategory(null);
      setSelectedMotorbike(null);
      setPaymentMethod('Cash');
      setNotes('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      handleClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySave = (newCategory) => {
    setCategories(prevCategories => [
      ...prevCategories,
      { label: newCategory.name, value: newCategory._id }
    ]);
    setCategory({ label: newCategory.name, value: newCategory._id });
    setShowCategoryModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Record Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={onSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="amount">
                  <Form.Label className="text-danger">Expense</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaMoneyBill />
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter Expense"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Select
                    value={category}
                    onChange={(selectedOption) => setCategory(selectedOption)}
                    options={categories}
                    isClearable
                    isSearchable
                    placeholder="Select Category"
                  />
                  <Button variant="link" className="p-0 mt-2" onClick={() => setShowCategoryModal(true)}>
                    Add New Category
                  </Button>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="motorbike">
                  <Form.Label>Motorbike</Form.Label>
                  <Select
                    value={selectedMotorbike}
                    onChange={(selectedOption) => setSelectedMotorbike(selectedOption)}
                    options={motorbikes}
                    isClearable
                    isSearchable
                    placeholder="Select Motorbike"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="paymentMethod">
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
              <Col md={6}>
                <Form.Group controlId="dateTime">
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
              <Col md={6}>
                <Form.Group controlId="time">
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
              <Col md={12}>
                <Form.Group controlId="recordedBy">
                  <Form.Label>Recorded By</Form.Label>
                  <Form.Control type="text" value={currentUser} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="notes" className="mt-3">
              <Form.Label>Notes</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <FaStickyNote />
                </InputGroup.Text>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Optional"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
              {loading ? 'Saving...' : 'Save Expense'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <NewExpenseCategoryModal
        show={showCategoryModal}
        handleClose={() => setShowCategoryModal(false)}
        onCategoryCreated={handleCategorySave}
      />
    </>
  );
};

export default ExpenseModal;