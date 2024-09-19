import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReportSummary = ({ summary }) => {
  const navigate = useNavigate();

  const containerStyle = {
    padding: '16px',
    backgroundColor: '#2d3748', // Matches the gray-800 Tailwind color
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    color: 'white',
    textAlign: 'center',
  };

  const headerStyle = {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '16px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)', // 4 equal columns
    gap: '16px',
    textAlign: 'center',
  };

  const itemStyle = {
    marginBottom: '8px',
    cursor: 'pointer', // Make it clear that these are clickable
  };

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <div style={containerStyle}>
      <h5 style={headerStyle}>Summary</h5>
      <div style={gridStyle}>
        <div onClick={() => handleClick('/income')} style={itemStyle}>
          <strong>Total Income</strong>
          <div>₵{summary.income.toFixed(2)}</div>
        </div>
        <div onClick={() => handleClick('/expenses')} style={itemStyle}>
          <strong>Total Expenses</strong>
          <div>₵{summary.expenses.toFixed(2)}</div>
        </div>
        <div onClick={() => handleClick('/transfers')} style={itemStyle}>
          <strong>Total Transfers</strong>
          <div>₵{summary.transfers.toFixed(2)}</div>
        </div>
        <div>
          <strong style={itemStyle}>Net Balance</strong>
          <div>₵{(summary.income - summary.expenses).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummary;
