import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { FaMotorcycle, FaMoneyBill, FaWallet, FaStickyNote, FaPhoneAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import Select from "react-select";

const TransferModal = ({ show, handleClose, handleSave }) => {
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Momo");
  const [notes, setNotes] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [motorbikes, setMotorbikes] = useState([]);

  const currentUser = useSelector((state) => state.user.currentUser?.userName || "");

  // Fetch motorbikes with filtering based on user
  useEffect(() => {
    const fetchMotorbikes = async () => {
      try {
        const response = await fetch("/api/motorbikes");
        const data = await response.json();

        const filteredMotorbikes = data.filter((motorbike) => {
          if (currentUser === "Pinkrah") {
            return motorbike.registrationNumber === "M-24-VR 1084(Partnership)";
          } else if (currentUser === "Miller") {
            return motorbike.registrationNumber === "ABOBOYAA-BIKE 1";
          } else if (currentUser === "David") {
            return motorbike.registrationNumber !== "ABOBOYAA-BIKE 1";
          }
          return motorbike.registrationNumber !== "Unknown";
        });

        setMotorbikes(
          filteredMotorbikes.map((motorbike) => ({
            label: motorbike.registrationNumber,
            value: motorbike._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching motorbikes:", error);
      }
    };

    fetchMotorbikes();
  }, [currentUser]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const transferData = {
      motorbike: selectedMotorbike?.value || "",
      amount,
      paymentMethod,
      momoNumber: paymentMethod === "Momo" ? momoNumber : "",
      notes,
      recordedBy: currentUser,
    };

    try {
      const response = await fetch("/api/transfers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        throw new Error("Failed to save transfer");
      }

      const result = await response.json();
      window.alert("Transfer saved successfully!");
      handleSave(result);
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      window.alert("Error saving transfer");
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Record Fund Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          {/* Motorbike and Amount */}
          <Row>
            <Col md={6}>
              <Form.Group controlId="motorbike" className="mt-3">
                <Form.Label>Motorbike</Form.Label>
                <Select
                  value={selectedMotorbike}
                  onChange={(option) => setSelectedMotorbike(option)}
                  options={motorbikes}
                  isClearable
                  isSearchable
                  placeholder="Select Motorbike"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
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
            </Col>
          </Row>

          {/* Payment Method and Momo Number */}
          <Row>
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
            {paymentMethod === "Momo" && (
              <Col md={6}>
                <Form.Group controlId="momoNumber" className="mt-3">
                  <Form.Label>Momo Number</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaPhoneAlt />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Enter Momo number"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      required={paymentMethod === "Momo"}
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
            )}
          </Row>

          {/* Notes and Recorded By */}
          <Row>
            <Col md={6}>
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
            </Col>
            <Col md={6}>
              <Form.Group controlId="recordedBy" className="mt-3">
                <Form.Label>Recorded By</Form.Label>
                <Form.Control type="text" value={currentUser} readOnly />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="mt-4">
            Save Transfer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TransferModal;
