import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Table, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const DailySalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);

  // Additional state variables
  const [selectedRecord, setSelectedRecord] = useState({});
  const [updatedSalesNumber, setUpdatedSalesNumber] = useState('');
  const [updatedSalesAmount, setUpdatedSalesAmount] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [modalEdit, setModalEdit] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/daily-sales?startDate=${startDate}&endDate=${endDate}`);
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

  // Calculate the total sales amount
  const totalSalesAmount = reportData.reduce((total, item) => total + item.salesAmount, 0);

  const [updatedDate, setUpdatedDate] = useState('');
  // Functions for handling edit, update, and delete actions
  const handleEdit = (record) => {
  setSelectedRecord(record);
  setUpdatedSalesNumber(record.salesNumber);
  setUpdatedSalesAmount(record.salesAmount);
  setUpdatedDate(new Date(record.date).toISOString().split('T')[0]); // Format date for input

  // Update the description with the selected date
  const formattedDate = new Date(updatedDate).toDateString();
  setUpdatedDescription(`Sales Made For ${formattedDate}\n${record.description}`);
  setModalEdit(true);
};

const handleUpdate = async () => {
  try {
    const response = await fetch(`/api/update-sales/${selectedRecord._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        salesNumber: updatedSalesNumber,
        salesAmount: updatedSalesAmount,
        date: updatedDate,
        description: updatedDescription, // Description already includes the formatted date
      }),
    });

    if (response.ok) {
      setModalEdit(false);
      setUpdateSuccess(true);

      // Refresh report data after update
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/daily-sales?startDate=${startDate}&endDate=${endDate}`);
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
      console.error('Failed to update sales record');
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
        const response = await fetch(`/api/delete-sales-record/${recordId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          // Refresh report data after deletion
          const fetchData = async () => {
            try {
              const response = await fetch(`/api/daily-sales?startDate=${startDate}&endDate=${endDate}`);
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
          console.error('Failed to delete sales record');
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
          <h2 className="mt-4 mb-3">Daily Sales Report</h2>
          <Table responsive className="table-shadow">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Sales Number</th>
                <th>Sales Amount</th>
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
                  <td>{item.salesNumber}</td>
                  <td>{item.salesAmount}</td>
                  <td>{item.description}</td>
                  <td>{item.recordedBy}</td>
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
                <th>Total Sales Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalSalesAmount}</td>
              </tr>
            </tbody>
          </Table>
        </>
      )}

      {/* Update Sales Record Modal */}
      <Modal isOpen={modalEdit} toggle={() => setModalEdit(!modalEdit)}>
  <ModalHeader toggle={() => setModalEdit(!modalEdit)}>Edit Sales Record</ModalHeader>
  <ModalBody>
    <Form>
      <FormGroup>
        <Label for="updatedDate">Date</Label>
        <Input
          type="date"
          name="updatedDate"
          id="updatedDate"
          value={updatedDate}
          onChange={(e) => setUpdatedDate(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="updatedSalesNumber">Sales Number</Label>
        <Input
          type="text"
          name="updatedSalesNumber"
          id="updatedSalesNumber"
          value={updatedSalesNumber}
          onChange={(e) => setUpdatedSalesNumber(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="updatedSalesAmount">Sales Amount</Label>
        <Input
          type="number"
          name="updatedSalesAmount"
          id="updatedSalesAmount"
          value={updatedSalesAmount}
          onChange={(e) => setUpdatedSalesAmount(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <Label for="updatedDescription">Description</Label>
        <Input
          type="textarea"
          name="updatedDescription"
          id="updatedDescription"
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
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

export default DailySalesReport;
