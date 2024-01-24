import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { BsCreditCard, BsFileText } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaDollarSign } from 'react-icons/fa';
import { FaGasPump, FaWrench, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';




const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  const handleButtonClick = (route) => {
    // Navigate to a specific route
    window.location.href = route;
  };

  return (
    <div className="home-container">
      <Container>
      <marquee style={{ color: 'purple', fontSize: '30px', fontWeight: 'bold', fontFamily: 'Arial, sans-serif', marginBottom: '10px' }}>
  Welcome to Nananom Deliveries, <span style={{ color: 'orange', fontSize: '40px' }}>{(currentUser?.userName || 'Guest').toUpperCase()}</span>!
</marquee>


        <Row>
        <Col md={4}>
  <Link to="/record-daily-sales">
    <Card className="animated-card card-sales">
      <Card.Body>
        <FaDollarSign className="icon" style={{ color: '#4CAF50' }} />
        <Card.Title style={{ textDecoration: 'none' }}>Tap To Record Daily Sales</Card.Title>
      </Card.Body>
    </Card>
  </Link>
</Col>


          {(currentUser?.role === 'manager' || currentUser?.role === 'ceo') && (
            <>
             <Col md={4}>
  <Card className="animated-card card-expense">
    <Card.Body>
      <BsCreditCard className="icon" />
      <Card.Title>Expense</Card.Title>
      <Button variant="primary" className="expense-button me-2 mt-2" onClick={() => handleButtonClick('/buy-fuel')}>
        <FaGasPump className="button-icon" /> Fuel
      </Button>
      <Button
        variant="success"
        className="expense-button me-2 mt-2"
        onClick={() => handleButtonClick('/record-maintenance')}
        style={{ backgroundColor: 'purple', borderColor: 'purple' }}
      >
        <FaWrench className="button-icon" /> Maintenance
      </Button>
      <Button variant="warning" className="expense-button me-2 mt-2" onClick={() => handleButtonClick('/record-other-expense')}>
        <FaExclamationTriangle className="button-icon" /> Other Expense
      </Button>
    </Card.Body>
  </Card>
</Col>

              {currentUser?.role === 'ceo' && (
                <Col md={4}>
                <Card className="animated-card card-report">
                  <Card.Body>
                    <BsFileText className="icon" />
                    <Card.Title>Report</Card.Title>
              
                    {/* Add Daily Sales Report Button */}
                    <Button variant="primary" className="report-button me-2 mt-2" onClick={() => handleButtonClick('/daily-sales-report')}>
                      <FaDollarSign className="button-icon" /> Daily Sales Report
                    </Button>
              
                    {/* Fuel Report Button */}
                    <Button variant="info" className="report-button me-2 mt-2" onClick={() => handleButtonClick('/fuel-reports')}>
                      <FaGasPump className="button-icon" /> Fuel Report
                    </Button>
              
                    {/* Maintenance Report Button */}
                    <Button
  variant="success"
  className="report-button me-2 mt-2"
  onClick={() => handleButtonClick('/maintenance-reports')}
  style={{ backgroundColor: 'purple', borderColor: 'purple' }}
>
  <FaWrench className="button-icon" /> Maintenance Report
</Button>

              
                    {/* Other Expense Report Button */}
                    <Button variant="warning" className="report-button me-2 mt-2" onClick={() => handleButtonClick('/other-expense-reports')}>
                      <FaDollarSign className="button-icon" /> Other Expense Report
                    </Button>
              
                    {/* Profit and Loss Report Button */}
                    <Button
  variant="danger"
  className="report-button me-2 mt-2"
  onClick={() => handleButtonClick('/profit-loss-reports')}
  style={{ backgroundColor: 'green', borderColor: 'green' }}
>
  <FaChartLine className="button-icon" /> Profit and Loss Report
</Button>

                  </Card.Body>
                </Card>
              </Col>
              )}
            </>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
