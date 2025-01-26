import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const ExpenseReportViewer = () => {
  const [expenses, setExpenses] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    motorbike: null,
    category: null,
  });

  const currentUser = useSelector((state) => state.user.currentUser?.userName || "");

  // Fetch motorbikes
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch("/api/motorbikes");
        if (response.ok) {
          const result = await response.json();

          // Filter motorbikes based on user roles
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

          setBikes(
            filteredBikes.map((bike) => ({
              value: bike._id,
              label: bike.registrationNumber,
            }))
          );
        } else {
          console.error("Failed to fetch motorbikes.");
        }
      } catch (error) {
        console.error("Error fetching motorbikes:", error);
      }
    };

    fetchBikes();
  }, [currentUser]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/expense-categories");
        if (response.ok) {
          const result = await response.json();
          setCategories(
            (result || []).map((category) => ({
              value: category._id,
              label: category.name,
            }))
          );
        } else {
          console.error("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!filters.motorbike) return;

      const queryParams = new URLSearchParams({
        motorbikeId: filters.motorbike?.value || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        notes: filters.search || "",
        category: filters.category?.value || "",
      }).toString();

      try {
        const response = await fetch(`/api/expenses-motorbike?${queryParams}`);
        if (response.ok) {
          const result = await response.json();
          setExpenses(
            Array.isArray(result.data)
              ? result.data.sort((a, b) => new Date(b.date) - new Date(a.date))
              : []
          );
        } else {
          setExpenses([]);
        }
      } catch (error) {
        setExpenses([]);
      }
    };

    fetchExpenses();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="motorbike-expense-report-container">
      <div className="motorbike-expense-report-header">
        <Select
          className="motorbike-expense-report-input"
          options={bikes}
          placeholder="Select Motorbike"
          isClearable
          value={filters.motorbike}
          onChange={(value) => handleFilterChange("motorbike", value)}
        />
      </div>

      {filters.motorbike && (
        <Card className="mt-3">
          <Card.Body>
            <h5>Total Expenses: GHC {totalExpenses.toLocaleString()}</h5>
          </Card.Body>
        </Card>
      )}

      {filters.motorbike && (
        <>
          <div className="motorbike-expense-report-filters mt-3">
            <Row>
              <Col md={3}>
                <Select
                  options={categories}
                  placeholder="Filter by Category"
                  isClearable
                  value={filters.category}
                  onChange={(value) => handleFilterChange("category", value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="text"
                  placeholder="Search by notes"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Control
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
              </Col>
            </Row>
          </div>

          <div className="mt-3">
            <Button
              onClick={() => {
                const worksheet = XLSX.utils.json_to_sheet(expenses || []);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
                XLSX.writeFile(workbook, "ExpensesReport.xlsx");
              }}
            >
              Export to Excel
            </Button>
          </div>

          <div className="motorbike-expense-report-table mt-3">
            {expenses.length > 0 ? (
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Notes</th>
                    <th>Amount (GHC)</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense, index) => (
                    <tr key={expense.id}>
                      <td>{index + 1}</td>
                      <td>{new Date(expense.date).toDateString()}</td>
                      <td>{expense.category || "N/A"}</td>
                      <td>{expense.notes || "N/A"}</td>
                      <td>{expense.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p className="text-center mt-3">No expenses match the selected filters.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseReportViewer;
