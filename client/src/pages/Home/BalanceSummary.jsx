import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';

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
const groupByMotorbike = (transactions, allMotorbikes) => {
  const grouped = {};

  // Group by transactions
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

  // Ensure all motorbikes are included
  allMotorbikes.forEach((bike) => {
    if (!grouped[bike.registrationNumber]) {
      grouped[bike.registrationNumber] = { incomes: [], expenses: [] };
    }
  });

  return grouped;
};

const BalanceSummary = () => {
  const [motorbikeData, setMotorbikeData] = useState({});
  const [allMotorbikes, setAllMotorbikes] = useState([]);
  const currentUser = useSelector((state) => state.user.currentUser?.userName || '');

  // Fetch transactions and motorbikes from the API
  const fetchData = async () => {
    try {
      // Fetch motorbikes
      const motorbikeResponse = await fetch('/api/motorbikes');
      const motorbikes = await motorbikeResponse.json();

      setAllMotorbikes(motorbikes);

      // Fetch transactions
      const transactionResponse = await fetch('/api/incomes-expenses');
      const data = await transactionResponse.json();

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
      const groupedMotorbikeData = groupByMotorbike(allTransactions, motorbikes);
      setMotorbikeData(groupedMotorbikeData);
    } catch (error) {
      console.error('Error fetching data:', error);
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
      <Row className="justify-content-center">
        {Object.keys(motorbikeData)
          .filter((motorbike) => !(currentUser === 'Pinkrah' && motorbike === 'M-24-GR 4194')) // Filter out the motorbike for Pinkrah
          .map((motorbike, index) => {
            const incomes = motorbikeData[motorbike].incomes;
            const expenses = motorbikeData[motorbike].expenses;

            const totalIncomeWeek = calculateTotal(incomes, isDateInCurrentWeek);
            const totalExpenseWeek = calculateTotal(expenses, isDateInCurrentWeek);
            const totalIncomeMonth = calculateTotal(incomes, isDateInCurrentMonth);
            const totalExpenseMonth = calculateTotal(expenses, isDateInCurrentMonth);

            return (
              <Col xs={12} md={6} className="mb-4" key={index}>
                <div className={`summary-card motorbike-summary ${index % 2 === 0 ? 'weekly-summary' : 'monthly-summary'}`}>
                  <div className="summary-header">
                    <h5>Motorbike: {motorbike}</h5>
                    <span>{getCurrentWeekRange()}</span>
                  </div>

                  <div className="summary-table">
                    <div>
                      <strong>Weekly Income</strong>
                      <div>{totalIncomeWeek.toLocaleString()}</div>
                    </div>
                    <div>
                      <strong>Weekly Expense</strong>
                      <div className="text-danger">{totalExpenseWeek.toLocaleString()}</div>
                    </div>
                    <div>
                      <strong>Weekly Balance</strong>
                      <div>{(totalIncomeWeek - totalExpenseWeek).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="summary-header mt-3">
                    <h5>Monthly Summary</h5>
                    <span>{getCurrentMonthRange()}</span>
                  </div>
                  <div className="summary-table">
                    <div>
                      <strong>Monthly Income</strong>
                      <div>{totalIncomeMonth.toLocaleString()}</div>
                    </div>
                    <div>
                      <strong>Monthly Expense</strong>
                      <div className="text-danger">{totalExpenseMonth.toLocaleString()}</div>
                    </div>
                    <div>
                      <strong>Monthly Balance</strong>
                      <div>{(totalIncomeMonth - totalExpenseMonth).toLocaleString()}</div>
                    </div>
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
