import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Table } from 'reactstrap';

const DailySalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);
  const [showReport, setShowReport] = useState(false);

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

  return (
    <Container>
      <Row className="mt-4">
        <Col sm="12" md="6">
          <Form onSubmit={handleSubmit} style={{ background: 'rgba(255, 255, 255, 0.8)', padding: '20px', borderRadius: '10px' }}>
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="startDate">Start Date</Label>
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
                  <Label for="endDate">End Date</Label>
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
    </Container>
  );
};

export default DailySalesReport;
