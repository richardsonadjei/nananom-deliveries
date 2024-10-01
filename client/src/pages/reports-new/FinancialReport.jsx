import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import AccountingSummary from './Summary';
import TransactionControls from './TransactionControls';
import TransactionTable from './TransactionTable';
import ReportsHomeSidebar from './SideBar';
import { useMotorbike } from './allreports/MotorBikeContext'; // Import the useMotorbike hook

const Accounting = () => {
  const { selectedBikeId, setSelectedBikeId } = useMotorbike(); // Use the context
  const [showAccounting, setShowAccounting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [motorbikes, setMotorbikes] = useState([]);

  useEffect(() => {
    // Fetch available motorbikes to populate the dropdown
    const fetchMotorbikes = async () => {
      try {
        const response = await fetch('/api/motorbikes');
        const data = await response.json();
        setMotorbikes(data);
      } catch (error) {
        console.error('Error fetching motorbikes:', error);
      }
    };

    fetchMotorbikes();
  }, []);

  const handleBikeSelect = () => {
    if (selectedBikeId) {
      setShowAccounting(true);
    }
  };

  return (
    <Container fluid style={{ padding: 0, width: '100vw', margin: 0, overflowX: 'hidden' }}>
      <ReportsHomeSidebar />

      {!showAccounting ? (
        <div style={{ margin: '20px auto', maxWidth: '400px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '10px', boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)', animation: 'fadeIn 0.8s ease-in-out' }}>
          <h2 style={{ color: 'white', marginBottom: '15px', fontSize: '1.8rem' }}>Select a Motorbike</h2>
          <Form.Group controlId="motorbikeSelect">
            <Form.Label style={{ color: 'white', fontSize: '1rem', marginBottom: '10px' }}>Motorbike</Form.Label>
            <Form.Control
              as="select"
              value={selectedBikeId}
              onChange={(e) => setSelectedBikeId(e.target.value)} // Update the selected bike ID in the context
              style={{ maxWidth: '100%', margin: '0 auto', borderRadius: '4px', padding: '8px', border: '1px solid #28a745', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', transition: 'all 0.3s ease' }}
            >
              <option value="">Select a motorbike...</option>
              {motorbikes.map((bike) => (
                <option key={bike._id} value={bike._id}>
                  {bike.registrationNumber}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button
            variant="success"
            onClick={handleBikeSelect}
            disabled={!selectedBikeId}
            style={{ marginTop: '15px', padding: '8px 16px', borderRadius: '4px', fontSize: '0.9rem', boxShadow: '0px 4px 10px rgba(40, 167, 69, 0.3)', transition: 'transform 0.3s ease' }}
          >
            Show Accounting
          </Button>
        </div>
      ) : (
        <>
          <AccountingSummary motorbikeId={selectedBikeId} />
          <TransactionControls onSearch={setSearchTerm} onFilter={setFilter} motorbikeId={selectedBikeId} />
          <TransactionTable searchTerm={searchTerm} filter={filter} motorbikeId={selectedBikeId} />
        </>
      )}
    </Container>
  );
};

export default Accounting;
