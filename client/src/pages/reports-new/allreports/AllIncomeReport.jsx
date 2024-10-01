import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import ReportsHomeSidebar from '../SideBar';
import { useMotorbike } from './MotorBikeContext';

const AllIncome = () => {
  const { selectedBikeId } = useMotorbike(); // Use the context to get the selectedBikeId
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registrationNumber, setRegistrationNumber] = useState(''); // State to store the registration number

  useEffect(() => {
    const fetchRegistrationNumber = async () => {
      if (!selectedBikeId) return;

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
  }, [selectedBikeId]);

  useEffect(() => {
    const fetchIncomes = async () => {
      console.log('Selected Bike ID:', selectedBikeId); // Log the selectedBikeId to debug
      if (!selectedBikeId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/incomes/${selectedBikeId}`);
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

    fetchIncomes();
  }, [selectedBikeId]);

  // Calculate the sum of all incomes
  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <Container fluid style={{ padding: 0, width: '100vw', margin: 0, overflowX: 'hidden' }}>
      {/* Include the Sidebar as an off-canvas component */}
      <ReportsHomeSidebar />

      <Container fluid style={{ maxWidth: '100vw', overflowX: 'hidden', padding: '20px' }}>
        <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
          All Income for Motorbike: {registrationNumber ? registrationNumber : 'N/A'}
        </h2>

        {/* Display the total income */}
        <p style={{ color: 'white', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
          Total Income: Ghc {totalIncome.toLocaleString()}
        </p>

        {loading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
        ) : (
          <Table striped bordered hover variant="dark" responsive>
            <thead>
              <tr>
                <th>#</th>
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
                incomes.map((income, index) => (
                  <tr key={income._id}>
                    <td>{index + 1}</td>
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
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    No income records found for this motorbike.
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

export default AllIncome;
