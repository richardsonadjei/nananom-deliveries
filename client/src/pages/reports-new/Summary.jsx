import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AccountingSummary = ({ motorbikeId }) => {
  const [chartData, setChartData] = useState({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Income',
        data: new Array(12).fill(0), // Placeholder for income data
        borderColor: 'green',
        backgroundColor: 'green',
        fill: false,
        pointRadius: 5,
      },
      {
        label: 'Expenses',
        data: new Array(12).fill(0), // Placeholder for expenses data
        borderColor: 'red',
        backgroundColor: 'red',
        fill: false,
        pointRadius: 5,
      },
    ],
  });

  const fetchTransactionData = async () => {
    try {
      const response = await fetch(`/api/incomes-expenses?motorbikeId=${motorbikeId}`);
      const data = await response.json();

      // Initialize arrays for monthly income and expenses totals
      const incomeMonthlyTotals = new Array(12).fill(0);
      const expensesMonthlyTotals = new Array(12).fill(0);

      // Calculate monthly income totals for the selected motorbike
      data.incomes.forEach((income) => {
        if (income.motorbike._id === motorbikeId) {
          const incomeDate = new Date(income.date);
          const month = incomeDate.getUTCMonth(); // Get month (0-11)
          incomeMonthlyTotals[month] += income.amount; // Sum income for each month
        }
      });

      // Calculate monthly expenses totals for the selected motorbike
      data.expenses.forEach((expense) => {
        if (expense.motorbike._id === motorbikeId) {
          const expenseDate = new Date(expense.date);
          const month = expenseDate.getUTCMonth(); // Get month (0-11)
          expensesMonthlyTotals[month] += expense.amount; // Sum expenses for each month
        }
      });

      // Update the chart with new data
      setChartData({
        ...chartData,
        datasets: [
          {
            ...chartData.datasets[0],
            data: incomeMonthlyTotals,
          },
          {
            ...chartData.datasets[1],
            data: expensesMonthlyTotals,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  useEffect(() => {
    if (motorbikeId) {
      // Fetch data when a motorbike is selected
      fetchTransactionData();
    }
  }, [motorbikeId]);

  return (
    <div style={{ height: '300px' }}>
      <Line 
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                color: 'white', // Make legend text white
              },
            },
            tooltip: {
              bodyColor: 'white', // Tooltip text color
              titleColor: 'white',
            },
          },
          scales: {
            x: {
              ticks: {
                color: 'white', // Make x-axis labels white
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                color: 'white', // Make y-axis labels white
                callback: function(value) {
                  return value.toLocaleString(); // Format y-axis values with commas
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default AccountingSummary;
