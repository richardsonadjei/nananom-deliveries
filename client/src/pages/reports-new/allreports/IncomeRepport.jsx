import React, { useState, useEffect } from 'react';

const IncomeRecords = ({ motorbikeId }) => {
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncomeRecords = async () => {
      try {
        const response = await fetch(`/api/income/${motorbikeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch income records');
        }
        const data = await response.json();
        setIncomeRecords(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomeRecords();
  }, [motorbikeId]);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
    fontSize: '1rem',
    textAlign: 'left',
  };

  const thStyle = {
    backgroundColor: '#2d3748',
    color: 'white',
    padding: '12px',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  };

  const containerStyle = {
    padding: '16px',
    maxWidth: '100%',
    overflowX: 'auto', // Makes the table responsive
  };

  const responsiveTable = {
    width: '100%',
    marginTop: '20px',
    borderCollapse: 'collapse',
    backgroundColor: '#f9f9f9',
  };

  return (
    <div style={containerStyle}>
      <h2>Income Records</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table style={responsiveTable}>
          <thead>
            <tr>
              <th style={thStyle}>Amount (₵)</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Payment Method</th>
              <th style={thStyle}>Notes</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Recorded By</th>
            </tr>
          </thead>
          <tbody>
            {incomeRecords.length > 0 ? (
              incomeRecords.map((record) => (
                <tr key={record._id}>
                  <td style={tdStyle}>₵{record.amount.toFixed(2)}</td>
                  <td style={tdStyle}>{record.category}</td>
                  <td style={tdStyle}>{record.paymentMethod}</td>
                  <td style={tdStyle}>{record.notes || 'No notes'}</td>
                  <td style={tdStyle}>{new Date(record.date).toLocaleDateString()}</td>
                  <td style={tdStyle}>{record.time}</td>
                  <td style={tdStyle}>{record.recordedBy}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td style={tdStyle} colSpan="7">
                  No income records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IncomeRecords;
