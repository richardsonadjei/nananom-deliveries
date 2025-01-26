import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button } from "react-bootstrap";
import Select from "react-select";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const ProfitLossReportViewer = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netProfitOrLoss: 0,
    status: "",
  });
  const [motorbikes, setMotorbikes] = useState([]);
  const [filters, setFilters] = useState({
    motorbike: null,
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUser = useSelector((state) => state.user.currentUser?.userName || "");

  useEffect(() => {
    const fetchMotorbikes = async () => {
      try {
        const response = await fetch("/api/motorbikes");
        if (!response.ok) throw new Error("Failed to fetch motorbikes.");
        const result = await response.json();

        const filteredBikes = result.filter((bike) => {
          if (currentUser === "Pinkrah") {
            return bike.registrationNumber === "M-24-VR 1084(Partnership)";
          } else if (currentUser === "Miller") {
            return bike.registrationNumber === "ABOBOYAA-BIKE 1";
          } else if (currentUser === "David") {
            return bike.registrationNumber !== "ABOBOYAA-BIKE 1";
          }
          return bike.registrationNumber !== "Unknown";
        });

        setMotorbikes(
          filteredBikes.map((bike) => ({
            value: bike._id,
            label: bike.registrationNumber,
          }))
        );
      } catch (error) {
        console.error("Error fetching motorbikes:", error);
        setError("Unable to fetch motorbikes. Please try again later.");
      }
    };

    fetchMotorbikes();
  }, [currentUser]);

  useEffect(() => {
    if (!filters.motorbike) {
      setData([]);
      setSummary({
        totalIncome: 0,
        totalExpenses: 0,
        netProfitOrLoss: 0,
        status: "",
      });
      return;
    }

    const fetchProfitOrLoss = async () => {
      setLoading(true);
      setError("");

      const queryParams = new URLSearchParams({
        motorbikeId: filters.motorbike.value,
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
      }).toString();

      try {
        const response = await fetch(`/api/profit-loss-report-by-bike?${queryParams}`);
        if (!response.ok) throw new Error("Failed to fetch profit or loss data.");
        const result = await response.json();

        if (result.success) {
          const incomes = result.data.incomes || [];
          const expenses = result.data.expenses || [];

          const combinedData = [
            ...incomes.map((income) => ({
              ...income,
              type: "Income",
            })),
            ...expenses.map((expense) => ({
              ...expense,
              type: "Expense",
            })),
          ].sort((a, b) => new Date(b.date) - new Date(a.date)); 

          setData(combinedData);
          setSummary({
            totalIncome: incomes.reduce((sum, income) => sum + income.amount, 0),
            totalExpenses: expenses.reduce((sum, expense) => sum + expense.amount, 0),
            netProfitOrLoss:
              incomes.reduce((sum, income) => sum + income.amount, 0) -
              expenses.reduce((sum, expense) => sum + expense.amount, 0),
            status:
              incomes.reduce((sum, income) => sum + income.amount, 0) -
                expenses.reduce((sum, expense) => sum + expense.amount, 0) >=
              0
                ? "Profit"
                : "Loss",
          });
        } else {
          setError(result.message || "No data available for the selected filters.");
        }
      } catch (error) {
        console.error("Error fetching profit or loss:", error);
        setError("An error occurred while fetching the report. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfitOrLoss();
  }, [filters]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "ProfitLossReport");
    XLSX.writeFile(workbook, "ProfitLossReport.xlsx");
  };

  return (
    <div className="motorbike-profit-loss-container">
      <div className="motorbike-profit-loss-header">
        <Select
          className="motorbike-profit-loss-input"
          options={motorbikes}
          placeholder="Select Motorbike"
          value={filters.motorbike}
          onChange={(value) => setFilters((prev) => ({ ...prev, motorbike: value }))}
          isClearable
        />
        <div className="d-flex justify-content-center mt-3">
          <Form.Control
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
          />
          <Form.Control
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>

      {error && <p className="text-danger text-center">{error}</p>}

      {(summary.totalIncome > 0 || summary.totalExpenses > 0 || summary.netProfitOrLoss !== 0) && (
        <Card className="motorbike-profit-loss-card">
          <Card.Body>
            <h5>Total Income: GHC {summary.totalIncome.toLocaleString()}</h5>
            <h5>Total Expenses: GHC {summary.totalExpenses.toLocaleString()}</h5>
            <h5>
              Net {summary.status}: GHC {summary.netProfitOrLoss.toLocaleString()}
            </h5>
          </Card.Body>
        </Card>
      )}

      {data.length > 0 && (
        <div className="mt-3">
          <Button className="motorbike-profit-loss-button" onClick={exportToExcel}>
            Export to Excel
          </Button>
        </div>
      )}

      <div className="motorbike-profit-loss-table-container">
        {data.length > 0 ? (
          <Table className="motorbike-profit-loss-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Date</th>
                <th>Category</th>
                <th>Notes</th>
                <th>Amount (GHC)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, index) => (
                <tr
                  key={record._id}
                  className={`motorbike-profit-loss-row ${
                    record.type === "Income" ? "income-row" : "expense-row"
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>{record.type}</td>
                  <td>
  {new Date(record.date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  })}
</td>

                  <td>{record.type === "Expense" ? record.category.name || "N/A" : "N/A"}</td>
                  <td>{record.notes || "N/A"}</td>
                  <td>{record.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center mt-3">No data found for the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default ProfitLossReportViewer;
