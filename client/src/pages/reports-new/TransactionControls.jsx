import React, { useState, useEffect } from 'react';

const TransactionControls = ({ motorbikeId }) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const fetchTransactionsData = async () => {
    try {
      const response = await fetch(`/api/incomes-expenses?motorbikeId=${motorbikeId}`);
      if (!response.ok) {
        console.error('Error fetching data. Status:', response.status);
        return;
      }

      const data = await response.json();
      if (data && (data.incomes || data.expenses)) {
        const totalIncome = data.incomes
          .filter((income) => income.motorbike._id === motorbikeId)
          .reduce((sum, income) => sum + income.amount, 0);

        const totalExpense = data.expenses
          .filter((expense) => expense.motorbike._id === motorbikeId)
          .reduce((sum, expense) => sum + expense.amount, 0);

        const netBalance = totalIncome - totalExpense;

        setTotalIncome(totalIncome);
        setTotalExpense(totalExpense);
        setNetBalance(netBalance);
      } else {
        setTotalIncome(0);
        setTotalExpense(0);
        setNetBalance(0);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
    const intervalId = setInterval(fetchTransactionsData, 1000);
    return () => clearInterval(intervalId);
  }, [motorbikeId]);

  return (
    <div
      className="transaction-controls"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px auto',
        textAlign: 'center',
        maxWidth: '800px',
      }}
    >
      <div className="badge-container">
        <span className="badge income-badge" style={{ color: 'green', fontWeight: 'bold', marginRight: '10px',fontSize: '1.2rem', }}>
          Revenue: Ghc {totalIncome.toLocaleString()}
        </span>
        <span className="badge expense-badge" style={{ color: 'red', fontWeight: 'bold', marginRight: '10px',fontSize: '1.2rem', }}>
          Expenses: Ghc {totalExpense.toLocaleString()}
        </span>
        <span
          className="badge net-balance-badge"
          style={{
            color: netBalance >= 0 ? 'green' : 'red',
            fontWeight: 'bold',
            marginRight: '10px',
            fontSize: '1.2rem',
          }}
        >
          {netBalance >= 0
            ? `Profit: Ghc ${netBalance.toLocaleString()}`
            : `Loss: Ghc ${Math.abs(netBalance).toLocaleString()}`}
        </span>
      </div>
    </div>
  );
};

export default TransactionControls;
