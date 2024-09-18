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

const BalanceSummary = () => {
  const [totalIncomeWeek, setTotalIncomeWeek] = useState(0);
  const [totalExpenseWeek, setTotalExpenseWeek] = useState(0);
  const [totalIncomeMonth, setTotalIncomeMonth] = useState(0);
  const [totalExpenseMonth, setTotalExpenseMonth] = useState(0);

  // Fetch transactions from the API every second
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

      const totalIncomeThisWeek = incomes
        .filter((income) => isDateInCurrentWeek(new Date(income.date)))
        .reduce((acc, income) => acc + income.amount, 0);

      const totalExpenseThisWeek = expenses
        .filter((expense) => isDateInCurrentWeek(new Date(expense.date)))
        .reduce((acc, expense) => acc + expense.amount, 0);

      const totalIncomeThisMonth = incomes
        .filter((income) => isDateInCurrentMonth(new Date(income.date)))
        .reduce((acc, income) => acc + income.amount, 0);

      const totalExpenseThisMonth = expenses
        .filter((expense) => isDateInCurrentMonth(new Date(expense.date)))
        .reduce((acc, expense) => acc + expense.amount, 0);

      setTotalIncomeWeek(totalIncomeThisWeek);
      setTotalExpenseWeek(totalExpenseThisWeek);
      setTotalIncomeMonth(totalIncomeThisMonth);
      setTotalExpenseMonth(totalExpenseThisMonth);
    } catch (error) {
      console.error('Error fetching income and expense data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const calculateBalance = (income, expenses) => income - expenses;

  return (
    <div className="balance-summary">
      <Row>
        <Col xs={12} md={6} className="mb-4">
          <div className="summary-card weekly-summary">
            <div className="summary-header">
              <h5>Weekly Summary</h5>
              <span>{getCurrentWeekRange()}</span>
            </div>
            <div className="summary-table">
              <div>Income</div><div>{totalIncomeWeek.toLocaleString()}</div>
              <div>Expense</div><div className="text-danger">{totalExpenseWeek.toLocaleString()}</div>
              <div>Balance</div><div>{calculateBalance(totalIncomeWeek, totalExpenseWeek).toLocaleString()}</div>
            </div>
          </div>
        </Col>

        <Col xs={12} md={6} className="mb-4">
          <div className="summary-card monthly-summary">
            <div className="summary-header">
              <h5>Monthly Summary</h5>
              <span>{getCurrentMonthRange()}</span>
            </div>
            <div className="summary-table">
              <div>Income</div><div>{totalIncomeMonth.toLocaleString()}</div>
              <div>Expense</div><div className="text-danger">{totalExpenseMonth.toLocaleString()}</div>
              <div>Balance</div><div>{calculateBalance(totalIncomeMonth, totalExpenseMonth).toLocaleString()}</div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const isDateInCurrentWeek = (date) => {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(startOfWeek.getDate() + 6));
  return date >= startOfWeek && date <= endOfWeek;
};

const isDateInCurrentMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

export default BalanceSummary;
