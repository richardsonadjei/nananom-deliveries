import React, { useState, useEffect } from 'react';
import { Table, Dropdown } from 'react-bootstrap';

const TransactionTable = ({ searchTerm, filter, motorbikeId }) => {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from the API for the selected motorbike
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/incomes-expenses');
      const data = await response.json();

      if (data.incomes && data.expenses) {
        // Combine income and expenses into one array and assign the type manually
        const incomeTransactions = data.incomes
          .filter((item) => item.motorbike._id === motorbikeId) // Filter by selected motorbike
          .map((item) => ({
            ...item,
            transactionType: 'Income',
          }));

        const expenseTransactions = data.expenses
          .filter((item) => item.motorbike._id === motorbikeId) // Filter by selected motorbike
          .map((item) => ({
            ...item,
            transactionType: 'Expense',
          }));

        // Update state with filtered transactions
        setTransactions([...incomeTransactions, ...expenseTransactions]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    if (motorbikeId) {
      // Fetch transactions for the selected motorbike
      fetchTransactions();

      // Set an interval to fetch transactions every second (1000 ms)
      const intervalId = setInterval(fetchTransactions, 1000);

      // Cleanup interval when component unmounts or motorbikeId changes
      return () => clearInterval(intervalId);
    }
  }, [motorbikeId]);

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
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date from most recent to oldest

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
              // Determine the amount to display
              const amount = transaction.amount !== undefined
                ? transaction.amount.toFixed(2)
                : '0.00';

              // Extract category name if `category` is an object
              const category = typeof transaction.category === 'object' && transaction.category !== null
                ? transaction.category.name
                : transaction.category;

              // Conditional styling for the amount based on Income or Expense
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
                        <Dropdown.Item href="#/action-1">Edit</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
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
    </div>
  );
};

export default TransactionTable;
