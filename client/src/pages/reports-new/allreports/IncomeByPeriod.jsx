import React, { useState, useEffect } from 'react';
import { Table, Container, Form, Button } from 'react-bootstrap';
import ReportsHomeSidebar from '../SideBar';
import { useMotorbike } from './MotorBikeContext';

const IncomeByPeriod = () => {
  const { selectedBikeId } = useMotorbike(); // Use the context to get the selectedBikeId
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState(''); // State to store the registration number

  useEffect(() => {
    if (!selectedBikeId) {
      setIncomes([]);
      setRegistrationNumber('');
    } else {
      // Fetch the registration number of the selected bike
      const fetchRegistrationNumber = async () => {
        try {
          const response = await fetch(`/api/motorbikes/${selectedBikeId}`);
          if (!response.ok) {
            console.error('Error fetching motorbike details:', response.status);
            return;
          }

          const data = await response.json();
          setRegistrationNumber(data.registrationNumber);
        } catch (error) {
          console.error('Error fetching motorbike details:', error);
        }
      };

      fetchRegistrationNumber();
    }
  }, [selectedBikeId]);

  const fetchIncomesByPeriod = async () => {
    if (!selectedBikeId || !startDate || !endDate) {
      alert('Please select a motorbike and both start and end dates.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/incomes/${selectedBikeId}?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        console.error('Error fetching incomes:', response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setIncomes(data.incomes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching incomes:', error);
      setLoading(false);
    }
  };

  return (
    <Container fluid style={{ padding: 0, width: '100vw', margin: 0, overflowX: 'hidden' }}>
      {/* Include the Sidebar as an off-canvas component */}
      <ReportsHomeSidebar />

      <Container fluid style={{ maxWidth: '100vw', overflowX: 'hidden', padding: '20px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
          View Income for {registrationNumber ? `Motorbike: ${registrationNumber}` : 'Selected Motorbike'} Within a Period
        </h2>
        
        {/* Date Selection Form */}
        <Form inline style={{ justifyContent: 'center', marginBottom: '20px' }}>
          <Form.Group controlId="startDate">
            <Form.Label style={{ color: 'white', marginRight: '10px' }}>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ marginRight: '20px', padding: '5px', borderRadius: '4px' }}
            />
          </Form.Group>
          <Form.Group controlId="endDate">
            <Form.Label style={{ color: 'white', marginRight: '10px' }}>End Date</Form.Label>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ marginRight: '20px', padding: '5px', borderRadius: '4px' }}
            />
          </Form.Group>
          <Button
            variant="success"
            onClick={fetchIncomesByPeriod}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '0.9rem',
              boxShadow: '0px 4px 10px rgba(40, 167, 69, 0.3)',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.03)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Show Income
          </Button>
        </Form>

        {/* Income Table */}
        {loading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
        ) : (
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount (Ghc)</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Notes</th>
                <th>Recorded By</th>
              </tr>
            </thead>
            <tbody>
              {incomes.length > 0 ? (
                incomes.map((income) => (
                  <tr key={income._id}>
                    <td>
                      {new Date(income.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: '2-digit'
                      })}
                    </td>
                    <td>{income.amount.toLocaleString()}</td>
                    <td>{income.category}</td>
                    <td>{income.paymentMethod}</td>
                    <td>{income.notes}</td>
                    <td>{income.recordedBy}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    No income records found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>
    </Container>
  );
};

export default IncomeByPeriod;
