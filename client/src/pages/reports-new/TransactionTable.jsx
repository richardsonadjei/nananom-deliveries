import React, { useState, useEffect } from 'react';
import { Table, Dropdown, Modal, Button } from 'react-bootstrap';

const TransactionTable = ({ searchTerm, filter, motorbikeId }) => {
  const [transactions, setTransactions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch transactions from the API for the selected motorbike
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/incomes-expenses');
      const data = await response.json();

      if (data.incomes && data.expenses) {
        const incomeTransactions = data.incomes
          .filter((item) => item.motorbike._id === motorbikeId)
          .map((item) => ({
            ...item,
            transactionType: 'Income',
          }));

        const expenseTransactions = data.expenses
          .filter((item) => item.motorbike._id === motorbikeId)
          .map((item) => ({
            ...item,
            transactionType: 'Expense',
          }));

        setTransactions([...incomeTransactions, ...expenseTransactions]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (motorbikeId) {
      fetchTransactions();
      const intervalId = setInterval(fetchTransactions, 1000);
      return () => clearInterval(intervalId);
    }
  }, [motorbikeId]);

  // Show delete modal
  const handleShowDeleteModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowDeleteModal(true);
  };

  // Delete transaction
  const handleDeleteTransaction = async () => {
    if (selectedTransaction) {
      const url = selectedTransaction.transactionType === 'Income'
        ? `/api/income/${selectedTransaction._id}`
        : `/api/expenses/${selectedTransaction._id}`;

      try {
        await fetch(url, {
          method: 'DELETE',
        });
        // Refresh transactions after deletion
        fetchTransactions();
        setShowDeleteModal(false);
        setSelectedTransaction(null);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const filteredTransactions = transactions
    .filter((transaction) => {
      const searchText = searchTerm.toLowerCase();
      return (
        (filter === 'All' || !filter || transaction.transactionType === filter) &&
        (
          transaction.notes?.toLowerCase().includes(searchText) ||
          transaction.category?.toLowerCase().includes(searchText) ||
          transaction.paymentMethod?.toLowerCase().includes(searchText) ||
          transaction.recordedBy?.toLowerCase().includes(searchText)
        )
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ height: '400px', overflowY: 'scroll' }}>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Date</th>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Category</th>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Payment Method</th>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Amount</th>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Notes</th>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Type</th>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Recorded By</th>
            <th style={{ fontSize: '14px', fontWeight: 'normal' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => {
              const amount = transaction.amount !== undefined
                ? transaction.amount.toFixed(2)
                : '0.00';

              const category = typeof transaction.category === 'object' && transaction.category !== null
                ? transaction.category.name
                : transaction.category;

              const amountStyle = {
                color: transaction.transactionType === 'Income' ? 'green' : 'red',
                fontWeight: 'normal',
                fontSize: '13px',
              };

              const badgeStyle = {
                backgroundColor: transaction.transactionType === 'Income' ? 'green' : 'red',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '12px',
                fontWeight: 'normal',
              };

              const dropdownToggleStyle = {
                padding: '2px 5px',
                fontSize: '12px',
              };

              return (
                <tr key={index}>
                  <td style={{ fontSize: '13px' }}>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td style={{ fontSize: '13px' }}>{category || 'N/A'}</td>
                  <td style={{ fontSize: '13px' }}>{transaction.paymentMethod || 'N/A'}</td>
                  <td style={amountStyle}>Ghc {amount}</td>
                  <td style={{ fontSize: '13px' }}>{transaction.notes || 'N/A'}</td>
                  <td>
                    <span style={badgeStyle}>
                      {transaction.transactionType}
                    </span>
                  </td>
                  <td style={{ fontSize: '13px' }}>{transaction.recordedBy || 'N/A'}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle style={dropdownToggleStyle} variant="light" id="dropdown-basic">
                        <i className="fas fa-ellipsis-h"></i>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleShowDeleteModal(transaction)}>Delete</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No transactions found for the selected motorbike.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this transaction?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTransaction}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TransactionTable;
