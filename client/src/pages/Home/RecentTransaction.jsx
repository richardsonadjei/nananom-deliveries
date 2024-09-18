import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';

const RecentTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/incomes-expenses');
      const data = await response.json();

      if (!data || (!data.incomes && !data.expenses)) {
        console.error('Invalid data structure', data);
        return;
      }

      // Combine income and expenses into one array and assign the type manually
      const incomeTransactions = data.incomes.map((item) => ({
        ...item,
        description: `Income from Motorbike ${item.motorbike?.model || ''} - ${item.motorbike?.registrationNumber || ''}`,
        transactionType: 'Income',
        color: 'text-success',
      }));

      const expenseTransactions = data.expenses.map((item) => ({
        ...item,
        description: `Expense for ${item.category?.name || 'General'} ${item.motorbike ? '- ' + item.motorbike.registrationNumber : ''}`,
        transactionType: 'Expense',
        color: 'text-danger',
      }));

      // Combine and sort transactions by date
      const allTransactions = [...incomeTransactions, ...expenseTransactions].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      // Only show the 5 most recent transactions
      setTransactions(allTransactions.slice(0, 5));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    // Fetch transactions every second (1000ms)
    const intervalId = setInterval(() => {
      fetchTransactions();
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to format the date as Mon Aug 8 -24
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
    return `${formattedDate} -${year}`;
  };

  return (
    <div className="recent-transactions">
      <h5>Recent Transactions</h5>
      <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}> {/* Set a max height and enable vertical scrolling */}
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <ListGroup.Item key={index}>
              <div className="transaction-date">{formatDate(transaction.date)}</div>
              <div className="transaction-description">
                {transaction.description}
                <span className={`transaction-amount ${transaction.color}`}>
                  {transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="transaction-type">{transaction.transactionType}</div>
            </ListGroup.Item>
          ))
        ) : (
          <p>No recent transactions found.</p>
        )}
      </ListGroup>
    </div>
  );
};

export default RecentTransactions;
