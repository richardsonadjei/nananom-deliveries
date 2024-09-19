import React, { useState, useEffect } from 'react';
import ReportSummary from './Summary';
import TransactionList from './Transaction';


const FinancialReportView = ({ selectedBike }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, transfers: 0 });

  useEffect(() => {
    if (selectedBike) {
      // Fetch financial reports for the selected bike
      const fetchTransactions = async () => {
        try {
          const response = await fetch(`/api/incomes-expenses?motorbikeId=${selectedBike}`);
          const data = await response.json();

          const income = data.incomes.reduce((sum, item) => sum + item.amount, 0);
          const expenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
          const transfers = data.expenses
            .filter((item) => item.category.name === 'Transfers')
            .reduce((sum, item) => sum + item.amount, 0);

          setSummary({ income, expenses, transfers });
          setTransactions([...data.incomes, ...data.expenses]);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      };

      fetchTransactions();
    }
  }, [selectedBike]);

  return (
    <div>
      <h5>Financial Report for Bike {selectedBike}</h5>
      <ReportSummary summary={summary} />
      <TransactionList transactions={transactions} />
    </div>
  );
};

export default FinancialReportView;
