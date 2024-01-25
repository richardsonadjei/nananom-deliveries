import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const OtherExpenseReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const [modalEdit, setModalEdit] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/other-expenses?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (response.ok) {
        setReportData(data);
        setShowReport(true);
      } else {
        console.error('Error:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Calculate the total amount
  const totalAmount = reportData.reduce((total, item) => total + item.amount, 0);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setModalEdit(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/update-other-expenses/${selectedRecord._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otherExpenseNumber: selectedRecord.otherExpenseNumber,
          amount: selectedRecord.amount,
          description: selectedRecord.description, // Include fields needed for update
          purchasedBy: selectedRecord.purchasedBy,
          // Add other fields as needed
        }),
      });

      if (response.ok) {
        setModalEdit(false);
        setUpdateSuccess(true);

        // Refresh report data after update
        const fetchData = async () => {
          try {
            const response = await fetch(`/api/other-expenses?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();

            if (response.ok) {
              setReportData(data);
            } else {
              console.error('Error:', data.error || 'Unknown error');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };

        fetchData();

        // Hide the success message after 4 seconds
        setTimeout(() => {
          setUpdateSuccess(false);
        }, 4000);
      } else {
        console.error('Failed to update other expense record');
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (recordId) => {
    // Display a confirmation alert
    const confirmDelete = window.confirm('Are you sure you want to delete this record?');

    if (confirmDelete) {
      try {
        const response = await fetch(`/api/delete-other-expenses/${recordId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh report data after deletion
          const fetchData = async () => {
            try {
              const response = await fetch(`/api/other-expenses?startDate=${startDate}&endDate=${endDate}`);
              const data = await response.json();

              if (response.ok) {
                setReportData(data);
              } else {
                console.error('Error:', data.error || 'Unknown error');
              }
            } catch (error) {
              console.error('Error:', error);
            }
          };

          fetchData();
        } else {
          console.error('Failed to delete other expense record');
        }
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <Container>
      <Row className="mt-4">
        <Col sm="12" md="6">
          <Form onSubmit={handleSubmit} style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="startDate" style={{ color: 'black', fontWeight: 'bold' }}>Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="endDate" style={{ color: 'black', fontWeight: 'bold' }}>End Date</Label>
                  <Input
                    type="date"
                    name="endDate"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Button color="primary" type="submit">
              Generate Report
            </Button>
          </Form>
        </Col>
      </Row>

      {showReport && (
        <>
          <h2 className="mt-4 mb-3">Other Expense Report</h2>
          <Table responsive className="table-shadow">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Other Expense Number</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Recorded By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{new Date(item.date).toLocaleDateString('en-GB')}</td>
                  <td>{item.otherExpenseNumber}</td>
                  <td>{item.amount}</td>
                  <td>{item.description}</td>
                  <td>{item.purchasedBy}</td>
                  <td>
                    <span className="mr-2" onClick={() => handleEdit(item)}>
                      <FaEdit className="text-primary" />
                    </span>
                    <span onClick={() => handleDelete(item._id)}>
                      <FaTrashAlt className="text-danger" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Summary Report */}
          <h3 className="mt-4 mb-3">Summary Report</h3>
          <Table responsive className="table-shadow">
            <thead>
              <tr>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalAmount}</td>
              </tr>
            </tbody>
          </Table>
        </>
      )}

      {/* Update Other Expense Modal */}
      <Modal isOpen={modalEdit} toggle={() => setModalEdit(!modalEdit)}>
        <ModalHeader toggle={() => setModalEdit(!modalEdit)}>Edit Other Expense</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="otherExpenseNumber">Other Expense Number</Label>
              <Input
                type="text"
                name="otherExpenseNumber"
                id="otherExpenseNumber"
                value={selectedRecord.otherExpenseNumber}
                onChange={(e) => setSelectedRecord({ ...selectedRecord, otherExpenseNumber: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="amount">Amount</Label>
              <Input
                type="number"
                name="amount"
                id="amount"
                value={selectedRecord.amount}
                onChange={(e) => setSelectedRecord({ ...selectedRecord, amount: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={selectedRecord.description}
                onChange={(e) => setSelectedRecord({ ...selectedRecord, description: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label for="purchasedBy">Purchased By</Label>
              <Input
                type="text"
                name="purchasedBy"
                id="purchasedBy"
                value={selectedRecord.purchasedBy}
                onChange={(e) => setSelectedRecord({ ...selectedRecord, purchasedBy: e.target.value })}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleUpdate}>
            Update
          </Button>{' '}
          <Button color="secondary" onClick={() => setModalEdit(!modalEdit)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default OtherExpenseReport;
