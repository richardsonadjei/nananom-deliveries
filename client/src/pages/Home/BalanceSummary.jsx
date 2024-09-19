import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

// Utility function to get the date range for the current week
const getCurrentWeekRange = () => {
  const now = new Date();
  const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Saturday

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
};

// Utility function to get the date range for the current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return `${formatDate(firstDayOfMonth)} - ${formatDate(lastDayOfMonth)}`;
};

// Group transactions by motorbike
const groupByMotorbike = (transactions) => {
  const grouped = {};

  transactions.forEach((transaction) => {
    const motorbike = transaction.motorbike?.registrationNumber || 'Unknown';
    if (!grouped[motorbike]) {
      grouped[motorbike] = { incomes: [], expenses: [] };
    }

    if (transaction.transactionType === 'Income') {
      grouped[motorbike].incomes.push(transaction);
    } else if (transaction.transactionType === 'Expense') {
      grouped[motorbike].expenses.push(transaction);
    }
  });

  return grouped;
};

const BalanceSummary = () => {
  const [motorbikeData, setMotorbikeData] = useState({});

  // Fetch transactions from the API
  const fetchData = async () => {
    try {
      const response = await fetch('/api/incomes-expenses');
      const data = await response.json();

      if (!data || (!data.incomes && !data.expenses)) {
        console.error('Invalid data structure', data);
        return;
      }

      const incomes = data.incomes || [];
      const expenses = data.expenses || [];

      // Mark the transaction type for better grouping
      const incomeTransactions = incomes.map((income) => ({
        ...income,
        transactionType: 'Income',
      }));

      const expenseTransactions = expenses.map((expense) => ({
        ...expense,
        transactionType: 'Expense',
      }));

      const allTransactions = [...incomeTransactions, ...expenseTransactions];

      // Group transactions by motorbike
      const groupedMotorbikeData = groupByMotorbike(allTransactions);
      setMotorbikeData(groupedMotorbikeData);
    } catch (error) {
      console.error('Error fetching income and expense data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000); // Update every second

    return () => clearInterval(intervalId);
  }, []);

  const calculateTotal = (transactions, filterFunction) => {
    return transactions
      .filter((transaction) => filterFunction(new Date(transaction.date)))
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  return (
    <div className="balance-summary">
      <Row>
        {Object.keys(motorbikeData).map((motorbike, index) => {
          const incomes = motorbikeData[motorbike].incomes;
          const expenses = motorbikeData[motorbike].expenses;

          const totalIncomeWeek = calculateTotal(incomes, isDateInCurrentWeek);
          const totalExpenseWeek = calculateTotal(expenses, isDateInCurrentWeek);
          const totalIncomeMonth = calculateTotal(incomes, isDateInCurrentMonth);
          const totalExpenseMonth = calculateTotal(expenses, isDateInCurrentMonth);

          return (
            <Col xs={12} md={6} className="mb-4" key={index}>
              <div className={`summary-card motorbike-summary ${index % 2 === 0 ? 'weekly-summary' : 'monthly-summary'}`}>
                {/* Motorbike and Weekly Summary */}
                <div className="summary-header">
                  <h5>Motorbike: {motorbike}</h5>
                  <span>{getCurrentWeekRange()}</span>
                </div>
                <div className="summary-table">
                  {/* Weekly Summary: Headers and Values Below */}
                  <Row>
                    <Col><strong>Weekly Income</strong><div>{totalIncomeWeek.toLocaleString()}</div></Col>
                    <Col><strong>Weekly Expense</strong><div className="text-danger">{totalExpenseWeek.toLocaleString()}</div></Col>
                    <Col><strong>Weekly Balance</strong><div>{(totalIncomeWeek - totalExpenseWeek).toLocaleString()}</div></Col>
                  </Row>
                </div>

                {/* Monthly Summary */}
                <div className="summary-header mt-3">
                  <h5>Monthly Summary</h5>
                  <span>{getCurrentMonthRange()}</span>
                </div>
                <div className="summary-table">
                  {/* Monthly Summary: Headers and Values Below */}
                  <Row>
                    <Col><strong>Monthly Income</strong><div>{totalIncomeMonth.toLocaleString()}</div></Col>
                    <Col><strong>Monthly Expense</strong><div className="text-danger">{totalExpenseMonth.toLocaleString()}</div></Col>
                    <Col><strong>Monthly Balance</strong><div>{(totalIncomeMonth - totalExpenseMonth).toLocaleString()}</div></Col>
                  </Row>
                </div>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

const isDateInCurrentWeek = (date) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return date >= startOfWeek && date <= endOfWeek;
};

const isDateInCurrentMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export default BalanceSummary;
