import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import IncomeCard from './Home/Income';
import ExpenseCard from './Home/Expense';
import TransferCard from './Home/Transfer';

import BalanceSummary from './Home/BalanceSummary';
import RecentTransactions from './Home/RecentTransaction';
import IncomeModal from './Income/AddIncomeModal';
import ExpenseModal from './Expense/AddExpenseModal';
import TransferModal from './Transfer/AddTransferModal';
import { useNavigate } from 'react-router-dom';
import Reports from './Home/Reports';

const Home = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); // State for Report Modal

  const navigate = useNavigate();

  // Handle Report Modal
  const handleShowReportModal = () => setShowReportModal(true);
  const handleCloseReportModal = () => setShowReportModal(false);

  // Handle Expense Modal
  const handleCloseExpense = () => setShowExpenseModal(false);
  const handleShowExpense = () => setShowExpenseModal(true);

  // Handle Income Modal
  const handleCloseIncome = () => setShowIncomeModal(false);
  const handleShowIncome = () => setShowIncomeModal(true);

  // Handle Transfer Modal
  const handleCloseTransfer = () => setShowTransferModal(false);
  const handleShowTransfer = () => setShowTransferModal(true);

  // Save Expense
  const handleSaveExpense = (expenseData) => {
    console.log('Saved Expense:', expenseData);
  };

  // Save Income
  const handleSaveIncome = (incomeData) => {
    console.log('Saved Income:', incomeData);
  };

  // Save Transfer
  const handleSaveTransfer = (transferData) => {
    console.log('Saved Transfer:', transferData);
  };

  return (
    <div className="home-container">
      <div className="button-grid">
        <Row>
          <Col xs={6} md={3}>
            <IncomeCard handleShow={handleShowIncome} />
          </Col>
          <Col xs={6} md={3}>
            <ExpenseCard handleShow={handleShowExpense} />
          </Col>
          <Col xs={6} md={3}>
            <TransferCard handleShow={handleShowTransfer} />
          </Col>
          <Col xs={6} md={3}>
            <Reports handleShowModal={handleShowReportModal} />
          </Col>
        </Row>
      </div>

      <BalanceSummary />
      <RecentTransactions />

      <ExpenseModal
        show={showExpenseModal}
        handleClose={handleCloseExpense}
        handleSave={handleSaveExpense}
      />

      <IncomeModal
        show={showIncomeModal}
        handleClose={handleCloseIncome}
        handleSave={handleSaveIncome}
      />

      <TransferModal
        show={showTransferModal}
        handleClose={handleCloseTransfer}
        handleSave={handleSaveTransfer}
      />

      {/* Report Modal */}
      <Modal show={showReportModal} onHide={handleCloseReportModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Select Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button
            className="mb-2"
            block
            variant="primary"
            onClick={() => {
              navigate('/income-reports');
              handleCloseReportModal();
            }}
          >
            Income Reports
          </Button>
          <Button
            className="mb-2"
            block
            variant="success"
            onClick={() => {
              navigate('/expense-reports');
              handleCloseReportModal();
            }}
          >
            Expense Reports
          </Button>
          <Button
            block
            variant="warning"
            onClick={() => {
              navigate('/motor-profit-loss-reports');
              handleCloseReportModal();
            }}
          >
            Profit/Loss Reports
          </Button>
        </Modal.Body>
       
      </Modal>
    </div>
  );
};

export default Home;
