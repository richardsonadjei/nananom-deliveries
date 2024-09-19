import React from 'react';

const TransactionList = ({ transactions }) => {
  return (
    <div>
      <h5>Transactions</h5>
      <ul>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <li key={index}>
              <div>
                <strong>{transaction.transactionType}:</strong> {transaction.amount.toFixed(2)}
              </div>
              <div>{transaction.description}</div>
              <div>Date: {new Date(transaction.date).toLocaleDateString()}</div>
            </li>
          ))
        ) : (
          <p>No transactions available for this bike.</p>
        )}
      </ul>
    </div>
  );
};

export default TransactionList;
