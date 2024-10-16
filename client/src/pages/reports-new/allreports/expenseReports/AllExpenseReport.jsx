import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useMotorbike } from '../MotorBikeContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ReportsHomeSidebar from '../../SideBar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AllExpenseReport = () => {
  const { selectedBikeId } = useMotorbike(); // Use the motorbike context to get the selected bike ID
  const [expenses, setExpenses] = useState([]);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!selectedBikeId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/expenses-motorbike/${selectedBikeId}`);
        if (!response.ok) {
          console.error('Error fetching expenses:', response.status);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setExpenses(data); // Adjust to the data structure returned by the server
        setLoading(false);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      }
    };

    const fetchMotorbikeDetails = async () => {
      if (!selectedBikeId) return;

      try {
        const response = await fetch(`/api/motorbikes/${selectedBikeId}`);
        if (!response.ok) {
          console.error('Error fetching motorbike details:', response.status);
          return;
        }

        const data = await response.json();
        setRegistrationNumber(data.registrationNumber); // Assuming the response contains the `registrationNumber`
      } catch (error) {
        console.error('Error fetching motorbike details:', error);
      }
    };

    fetchExpenses();
    fetchMotorbikeDetails();
  }, [selectedBikeId]);

  // Group expenses by category and calculate totals
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const { category, amount } = expense;
    if (!acc[category.name]) {
      acc[category.name] = { total: 0, items: [] };
    }
    acc[category.name].total += amount;
    acc[category.name].items.push(expense);
    return acc;
  }, {});

  // Prepare data for the bar chart using the aggregated totals
  const categories = Object.keys(groupedExpenses);
  const totals = categories.map((category) => groupedExpenses[category].total);

  // Assign different colors for each category
  const colors = [
    'rgba(75, 192, 192, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)',
    'rgba(0, 128, 128, 0.6)',
  ];

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Total Expenses by Category',
        data: totals,
        backgroundColor: colors.slice(0, categories.length), // Assign colors to categories
        borderColor: colors.map(color => color.replace('0.6', '1')), // Set border color
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 3, // Reduce the height of the chart
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white', // Set legend text color to white
        },
      },
      title: {
        display: true,
        text: 'Total Expenses by Category',
        color: 'white', // Set title text color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis labels color to white
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis labels color to white
        },
      },
    },
  };

  return (
    <Container fluid style={{ padding: 0, width: '100vw', margin: 0, overflowX: 'hidden' }}>
      {/* Include the Sidebar as an off-canvas component */}
      <ReportsHomeSidebar />

      <Container fluid style={{ padding: '20px', margin: '0 auto' }}>
        <h2 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
          All Expense Report for Motorbike: {registrationNumber}
        </h2>

        {loading ? (
          <p style={{ color: 'white', textAlign: 'center' }}>Loading...</p>
        ) : (
          <>
            {/* Bar Chart */}
            <div style={{ marginBottom: '40px', width: '100vw', height: '300px', margin: '0 auto' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Render each category's expenses in its own table */}
            {categories.map((categoryName) => (
              <div key={categoryName} style={{ marginBottom: '40px' }}>
                <h3 style={{ color: 'white', marginBottom: '15px' }}>
                  {categoryName} (Total: Ghc {groupedExpenses[categoryName].total.toLocaleString()})
                </h3>
                <Table striped bordered hover variant="dark" responsive>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount (Ghc)</th>
                      <th>Payment Method</th>
                      <th>Notes</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedExpenses[categoryName].items.map((expense) => (
                      <tr key={expense._id}>
                        <td>
                          {new Date(expense.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: '2-digit',
                          })}
                        </td>
                        <td>{expense.amount.toLocaleString()}</td>
                        <td>{expense.paymentMethod}</td>
                        <td>{expense.notes || 'N/A'}</td>
                        <td>{expense.recordedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ))}
          </>
        )}
      </Container>
    </Container>
  );
};

export default AllExpenseReport;
