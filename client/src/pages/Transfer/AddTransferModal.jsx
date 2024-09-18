import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, DropdownButton, Dropdown } from 'react-bootstrap';
import { FaMotorcycle, FaMoneyBill, FaWallet, FaStickyNote } from 'react-icons/fa';

const TransferModal = ({ show, handleClose, handleSave, motorbikes = [] }) => {
  const [selectedMotorbike, setSelectedMotorbike] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [notes, setNotes] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const transferData = {
      motorbike: selectedMotorbike,
      amount,
      paymentMethod,
      notes,
    };
    handleSave(transferData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Record Fund Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          {/* Select Motorbike */}
          <Form.Group controlId="motorbike" className="mt-3">
            <Form.Label>Motorbike</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaMotorcycle />
              </InputGroup.Text>
              <DropdownButton
                as={InputGroup.Append}
                variant="outline-secondary"
                title={selectedMotorbike || "Select Motorbike"}
                id="input-group-dropdown-2"
                onSelect={(e) => setSelectedMotorbike(e)}
              >
                {motorbikes.length > 0 ? (
                  motorbikes.map((bike, index) => (
                    <Dropdown.Item eventKey={bike} key={index}>
                      {bike}
                    </Dropdown.Item>
                  ))
                ) : (
                  <Dropdown.Item disabled>No Motorbikes Available</Dropdown.Item>
                )}
              </DropdownButton>
            </InputGroup>
          </Form.Group>

          {/* Amount */}
          <Form.Group controlId="amount" className="mt-3">
            <Form.Label>Transfer Amount</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaMoneyBill />
              </InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Enter transfer amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          {/* Payment Method */}
          <Form.Group controlId="paymentMethod" className="mt-3">
            <Form.Label>Payment Method</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaWallet />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter payment method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              />
            </InputGroup>
          </Form.Group>

          {/* Notes */}
          <Form.Group controlId="notes" className="mt-3">
            <Form.Label>Notes</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <FaStickyNote />
              </InputGroup.Text>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Add any notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-4">
            Save Transfer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransferModal;
