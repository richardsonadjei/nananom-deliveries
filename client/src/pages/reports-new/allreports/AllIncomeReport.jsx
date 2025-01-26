import React, { useState, useEffect } from "react";
import { Card, Table, Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import * as XLSX from "xlsx";
import { useSelector } from "react-redux";

const IncomeReportViewer = () => {
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    startDate: "",
    endDate: "",
    motorbike: null,
  });

  const currentUser = useSelector((state) => state.user.currentUser?.userName || "");

  // Fetch motorbikes
  useEffect(() => {
    const fetchBikes = async () => {
      try {
        const response = await fetch("/api/motorbikes");
        if (response.ok) {
          const result = await response.json();
          const filteredBikes = result.filter((bike) =>
            currentUser === "Pinkrah"
              ? bike.registrationNumber === "M-24-VR 1084(Partnership)"
              : true
          );

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

  // Fetch income records
  useEffect(() => {
    const fetchIncome = async () => {
      if (!filters.motorbike) return;

      const queryParams = new URLSearchParams({
        motorbikeId: filters.motorbike?.value || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        notes: filters.search || "",
      }).toString();

      try {
        const response = await fetch(`/api/income-report-motorbike?${queryParams}`);
        if (response.ok) {
          const result = await response.json();
          setIncomeRecords(
            Array.isArray(result.data)
              ? result.data.sort((a, b) => new Date(b.date) - new Date(a.date))
              : []
          );
        } else {
          setIncomeRecords([]);
        }
      } catch (error) {
        setIncomeRecords([]);
      }
    };

    fetchIncome();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);

  return (
    <div className="motorbike-income-report-container">
      <div className="motorbike-income-report-header">
        <Select
          className="motorbike-income-report-input"
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
            <h5>Total Income: GHC {totalIncome.toLocaleString()}</h5>
          </Card.Body>
        </Card>
      )}

      {filters.motorbike && (
        <>
          <div className="motorbike-income-report-filters mt-3">
            <Row>
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Search by notes"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
              </Col>
              <Col md={4}>
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
                const worksheet = XLSX.utils.json_to_sheet(incomeRecords || []);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Income");
                XLSX.writeFile(workbook, "IncomeReport.xlsx");
              }}
            >
              Export to Excel
            </Button>
          </div>

          <div className="motorbike-income-report-table mt-3">
            {incomeRecords.length > 0 ? (
              <div style={{ overflowX: "auto", overflowY: "auto", maxHeight: "400px" }}>
                <Table bordered hover style={{ minWidth: "1000px" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Motorbike</th>
                      <th>Category</th>
                      <th>Notes</th>
                      <th>Amount (GHC)</th>
                      <th>Recorded By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incomeRecords.map((record, index) => (
                      <tr key={record.id}>
                        <td>{index + 1}</td>
                        <td>{new Date(record.date).toDateString()}</td>
                        <td>{record.time || "N/A"}</td>
                        <td>{record.motorbike || "N/A"}</td>
                        <td>{record.category || "N/A"}</td>
                        <td>{record.notes || "N/A"}</td>
                        <td>{record.amount.toLocaleString()}</td>
                        <td>{record.recordedBy || "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p className="text-center mt-3">No income records match the selected filters.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default IncomeReportViewer;
