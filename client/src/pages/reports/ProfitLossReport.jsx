import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Row, Col, Table } from 'reactstrap';

const ProfitLossReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [financialSummary, setFinancialSummary] = useState(null);
  const [fuelExpenditureData, setFuelExpenditureData] = useState([]);
  const [maintenanceExpenseData, setMaintenanceExpenseData] = useState([]);
  const [otherExpenseData, setOtherExpenseData] = useState([]);
  const [dailySalesData, setDailySalesData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Fetch financial summary
      const summaryResponse = await fetch(`/api/financial-summary?startDate=${startDate}&endDate=${endDate}`);
      const summaryData = await summaryResponse.json();

      if (summaryResponse.ok) {
        setFinancialSummary(summaryData);
      } else {
        console.error('Error:', summaryData.error || 'Unknown error');
      }

      // Fetch fuel expenditure data
      const fuelResponse = await fetch(`/api/fuel-expenditures?startDate=${startDate}&endDate=${endDate}`);
      const fuelData = await fuelResponse.json();

      if (fuelResponse.ok) {
        setFuelExpenditureData(fuelData);
      } else {
        console.error('Error:', fuelData.error || 'Unknown error');
      }

      // Fetch maintenance expense data
      const maintenanceResponse = await fetch(`/api/maintenance-expenses?startDate=${startDate}&endDate=${endDate}`);
      const maintenanceData = await maintenanceResponse.json();

      if (maintenanceResponse.ok) {
        setMaintenanceExpenseData(maintenanceData);
      } else {
        console.error('Error:', maintenanceData.error || 'Unknown error');
      }

      // Fetch other expense data
      const otherResponse = await fetch(`/api/other-expenses?startDate=${startDate}&endDate=${endDate}`);
      const otherData = await otherResponse.json();

      if (otherResponse.ok) {
        setOtherExpenseData(otherData);
      } else {
        console.error('Error:', otherData.error || 'Unknown error');
      }

      // Fetch daily sales data
      const dailySalesResponse = await fetch(`/api/all-sales?startDate=${startDate}&endDate=${endDate}`);
      const dailySales = await dailySalesResponse.json();

      if (dailySalesResponse.ok) {
        setDailySalesData(dailySales);
      } else {
        console.error('Error:', dailySales.error || 'Unknown error');
      }

    } catch (error) {
      console.error('Error:', error);
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

      {financialSummary && (
        <>
          <h2 className="mt-4 mb-3">Profit/Loss Report</h2>
          <Table responsive className="table-shadow">
            <thead>
              <tr>
                <th>Total Income</th>
                <th>Total Fuel Expense</th>
                <th>Total Maintenance Expense</th>
                <th>Total Other Expense</th>
                <th>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{financialSummary.totalIncome}</td>
                <td>{financialSummary.totalExpenditure.fuel}</td>
                <td>{financialSummary.totalExpenditure.maintenance}</td>
                <td>{financialSummary.totalExpenditure.otherExpense}</td>
                <td>{financialSummary.profitLoss}</td>
              </tr>
            </tbody>
          </Table>

          {/* Fuel Expenditure Table Report */}
          <h3 className="mt-4 mb-3">Fuel Expenditure Report</h3>
          <Table responsive className="table-shadow">
            {/* Table headers */}
            <thead>
              <tr>
                <th>#</th>
                <th>Fuel Purchase Number</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Purchased By</th>
                <th>Description</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {fuelExpenditureData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.fuelPurchaseNumber}</td>
                  <td>{item.amount}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.purchasedBy}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Maintenance Expense Table Report */}
          <h3 className="mt-4 mb-3">Maintenance Expense Report</h3>
          <Table responsive className="table-shadow">
            {/* Table headers */}
            <thead>
              <tr>
                <th>#</th>
                <th>Maintenance Expense Number</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Purchased By</th>
                <th>Description</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {maintenanceExpenseData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.maintenanceExpenseNumber}</td>
                  <td>{item.amount}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.purchasedBy}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Other Expense Table Report */}
          <h3 className="mt-4 mb-3">Other Expense Report</h3>
          <Table responsive className="table-shadow">
            {/* Table headers */}
            <thead>
              <tr>
                <th>#</th>
                <th>Other Expense Number</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Purchased By</th>
                <th>Description</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {otherExpenseData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.otherExpenseNumber}</td>
                  <td>{item.amount}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.purchasedBy}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Daily Sales Table Report */}
          <h3 className="mt-4 mb-3">Daily Sales Report</h3>
          <Table responsive className="table-shadow">
            {/* Table headers */}
            <thead>
              <tr>
                <th>#</th>
                <th>Sales Number</th>
                <th>Sales Amount</th>
                <th>Date</th>
                <th>Recorded By</th>
                <th>Description</th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody>
              {dailySalesData.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.salesNumber}</td>
                  <td>{item.salesAmount}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.recordedBy}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
};

export default ProfitLossReport;
