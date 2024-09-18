import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

const NewExpenseCategoryModal = ({ show, handleClose, onCategoryCreated }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const newCategory = { name, notes };

    try {
      const response = await fetch('/api/expense-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        throw new Error('Failed to create expense category');
      }

      const data = await response.json();

      // Clear the form fields
      setName('');
      setNotes('');

      // Display success message
      setSuccess('Expense category created successfully!');

      // Pass the new category back to the parent component
      onCategoryCreated(data);

      // Close the modal after a delay
      setTimeout(() => {
        handleClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Expense Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="categoryName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="categoryNotes" className="mt-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Additional notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
            {loading ? 'Creating...' : 'Create Category'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewExpenseCategoryModal;