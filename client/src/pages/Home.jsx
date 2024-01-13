import React from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import { BsCreditCard, BsFileText } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  const handleButtonClick = (route) => {
    // Navigate to a specific route
    window.location.href = route;
  };

  return (
    <div className="home-container">
      <Container>
        <Row>
          <Col md={4}>
            <Link to="/record-daily-sales">
              <Card className="animated-card card-sales">
                <Card.Body>
                  <BsCreditCard className="icon" />
                  <Card.Title>Daily Sales</Card.Title>
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
                      Fuel
                    </Button>
                    <Button
                      variant="success"
                      className="expense-button me-2 mt-2"
                      onClick={() => handleButtonClick('/record-maintenance')}
                    >
                      Maintenance
                    </Button>
                    <Button variant="warning" className="expense-button me-2 mt-2" onClick={() => handleButtonClick('/record-other-expense')}>
                      Other Expense
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
                      <Button variant="info" className="report-button me-2 mt-2" onClick={() => handleButtonClick('/fuel-reports')}>
                        Fuel Report
                      </Button>
                      <Button
                        variant="success"
                        className="report-button me-2 mt-2"
                        onClick={() => handleButtonClick('/maintenance-reports')}
                      >
                        Maintenance Report
                      </Button>
                      <Button
                        variant="warning"
                        className="report-button me-2 mt-2"
                        onClick={() => handleButtonClick('/other-expense-reports')}
                      >
                        Other Expense Report
                      </Button>
                      <Button
                        variant="danger"
                        className="report-button me-2 mt-2"
                        onClick={() => handleButtonClick('/profit-loss-reports')}
                      >
                        Profit and Loss Report
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
