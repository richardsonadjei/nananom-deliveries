import React, { useState, useEffect } from 'react';
import { Nav, Offcanvas, Modal, Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaDollarSign, FaChartPie } from 'react-icons/fa';
import { useMotorbike } from './allreports/MotorBikeContext';

const ReportsHomeSidebar = ({ setSelectedDashboard }) => {
  const { selectedBikeId } = useMotorbike(); // Use the context to get the selectedBikeId
  const [registrationNumber, setRegistrationNumber] = useState(''); // State to store the registration number
  const [show, setShow] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [reportType, setReportType] = useState('all'); // State for radio button selection

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the registration number of the selected bike
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

  const handleClose = () => setShow(false);
  const handleShow = () => {
    if (selectedBikeId) {
      setShow(true);
    } else {
      alert('Please select a motorbike first.');
    }
  };

  const handleIncomeModalClose = () => setShowIncomeModal(false);
  const handleIncomeModalShow = () => {
    if (selectedBikeId) {
      setShowIncomeModal(true);
    } else {
      alert('Please select a motorbike first.');
    }
  };

  const handleExpenseModalClose = () => setShowExpenseModal(false);
  const handleExpenseModalShow = () => {
    if (selectedBikeId) {
      setShowExpenseModal(true);
    } else {
      alert('Please select a motorbike first.');
    }
  };

  const handleIncomeReportSelection = () => {
    setShowIncomeModal(false);
    if (reportType === 'all') {
      navigate(`/all-bike-income`);
    } else if (reportType === 'period') {
      navigate(`/all-bike-income-by-period`);
    }
  };

  const handleExpenseReportSelection = () => {
    setShowExpenseModal(false);
    if (reportType === 'all') {
      navigate(`/all-bike-expense`);
    } else if (reportType === 'period') {
      navigate(`/all-bike-expense-by-period`);
    }
  };

  return (
    <>
      {/* Sidebar Toggle Icon */}
      <div style={{ position: 'fixed', top: '65px', left: '20px', zIndex: 1040 }}>
        <FaBars
          onClick={handleShow}
          style={{
            color: 'yellow',
            fontSize: '1.2rem',
            cursor: 'pointer',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        />
      </div>

      {/* Offcanvas Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        className="custom-offcanvas"
        style={{
          backgroundColor: '#242526',
          color: 'white',
          transition: 'transform 0.5s ease-in-out',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.7)',
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title style={{ color: 'yellow', fontWeight: 'bold' }}>
            Reports for {registrationNumber ? `Motorbike: ${registrationNumber}` : 'N/A'}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ padding: '10px', animation: 'fadeIn 1s ease-in-out' }}>
          <Nav defaultActiveKey="/cash-crop" className="flex-column custom-nav-links">
            <Nav.Link
              as="button"
              onClick={handleExpenseModalShow}
              className="custom-nav-link"
              style={{
                color: 'white',
                marginBottom: '5px',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 'none',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#495057')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <FaChartPie style={{ marginRight: '10px' }} /> Expense By Category
            </Nav.Link>
            <Nav.Link
              as="button"
              onClick={handleIncomeModalShow}
              className="custom-nav-link"
              style={{
                color: 'white',
                borderRadius: '5px',
                transition: 'background-color 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'transparent',
                border: 'none',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#495057')}
              onMouseOut={(e) => (e.target.style.backgroundColor = 'transparent')}
            >
              <FaDollarSign style={{ marginRight: '10px' }} /> Income 
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modal for Selecting Expense Report Type */}
      <Modal show={showExpenseModal} onHide={handleExpenseModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Expense Report Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              label="View All Expense Reports"
              name="reportType"
              value="all"
              checked={reportType === 'all'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="View Expense Within a Particular Period"
              name="reportType"
              value="period"
              checked={reportType === 'period'}
              onChange={(e) => setReportType(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleExpenseModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleExpenseReportSelection}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Selecting Income Report Type */}
      <Modal show={showIncomeModal} onHide={handleIncomeModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Income Report Type</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              label="View All Income Reports"
              name="reportType"
              value="all"
              checked={reportType === 'all'}
              onChange={(e) => setReportType(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="View Income Within a Particular Period"
              name="reportType"
              value="period"
              checked={reportType === 'period'}
              onChange={(e) => setReportType(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleIncomeModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleIncomeReportSelection}>
            Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReportsHomeSidebar;
