import React from 'react';

const ReportSummary = ({ summary }) => {
  return (
    <div>
      <h5>Summary</h5>
      <div>
        <strong>Total Income:</strong> {summary.income.toFixed(2)}
      </div>
      <div>
        <strong>Total Expenses:</strong> {summary.expenses.toFixed(2)}
      </div>
      <div>
        <strong>Total Transfers:</strong> {summary.transfers.toFixed(2)}
      </div>
      <div>
        <strong>Net Balance:</strong> {(summary.income - summary.expenses).toFixed(2)}
      </div>
    </div>
  );
};

export default ReportSummary;
