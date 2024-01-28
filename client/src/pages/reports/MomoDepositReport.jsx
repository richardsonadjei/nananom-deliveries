import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Table } from 'reactstrap';

const MomoDepositReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/momo-deposits?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (response.ok) {
        setReportData(Array.isArray(data.data) ? data.data : []); // Ensure data is an array
        setShowReport(true);
      } else {
        console.error('Error:', data.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return new Date(dateString).toLocaleDateString('en-GB', options);
  };

  // Calculate the total deposit amount
  const totalDepositAmount = reportData.reduce((total, item) => total + item.depositAmount, 0);

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
          <h2 className="mt-4 mb-3">MoMo Deposit Report</h2>
          <Table responsive className="table-shadow">
            <thead>
              <tr>
                <th>#</th>
                <th>Date</th>
                <th>Deposit Number</th>
                <th>Deposit Amount</th>
                <th>Description</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(item.date)}</td>
                  <td>{item.depositNumber}</td>
                  <td>{item.depositAmount}</td>
                  <td>{item.description}</td>
                  <td>{item.recordedBy}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Summary Report */}
          <h3 className="mt-4 mb-3">Summary Report</h3>
          <Table responsive className="table-shadow">
            <thead>
              <tr>
                <th>Total Deposit Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{totalDepositAmount}</td>
              </tr>
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default MomoDepositReport;
