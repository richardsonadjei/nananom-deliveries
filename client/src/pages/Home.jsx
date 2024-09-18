import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import IncomeCard from './Home/Income';
import ExpenseCard from './Home/Expense';
import TransferCard from './Home/Transfer';
import TransactionCard from './Home/Transaction';
import BalanceSummary from './Home/BalanceSummary';
import RecentTransactions from './Home/RecentTransaction';
import IncomeModal from './Income/AddIncomeModal';
import ExpenseModal from './Expense/AddExpenseModal';
import TransferModal from './Transfer/AddTransferModal';


const Home = () => {
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false); 
  const [showTransferModal, setShowTransferModal] = useState(false); // State for TransferModal

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
    // Handle saving logic here (e.g., send data to backend)
  };

  // Save Income
  const handleSaveIncome = (incomeData) => {
    console.log('Saved Income:', incomeData);
    // Handle saving logic here (e.g., send data to backend)
  };

  // Save Transfer
  const handleSaveTransfer = (transferData) => {
    console.log('Saved Transfer:', transferData);
    // Handle saving logic here (e.g., send data to backend)
  };

  return (
    <div className="home-container">
      <div className="button-grid">
        <Row>
          <Col xs={6} md={3}>
            <IncomeCard handleShow={handleShowIncome} /> {/* Pass handleShowIncome to IncomeCard */}
          </Col>
          <Col xs={6} md={3}>
            <ExpenseCard handleShow={handleShowExpense} /> {/* Pass handleShowExpense to ExpenseCard */}
          </Col>
          <Col xs={6} md={3}>
            <TransferCard handleShow={handleShowTransfer} /> {/* Pass handleShowTransfer to TransferCard */}
          </Col>
          <Col xs={6} md={3}>
            <TransactionCard />
          </Col>
        </Row>
      </div>

      <BalanceSummary />
      <RecentTransactions />

      {/* Expense Modal */}
      <ExpenseModal
        show={showExpenseModal}
        handleClose={handleCloseExpense}
        handleSave={handleSaveExpense}
      />

      {/* Income Modal */}
      <IncomeModal
        show={showIncomeModal}
        handleClose={handleCloseIncome}
        handleSave={handleSaveIncome}
      />

      {/* Transfer Modal */}
      <TransferModal
        show={showTransferModal}
        handleClose={handleCloseTransfer}
        handleSave={handleSaveTransfer}
      />
    </div>
  );
};

export default Home;
