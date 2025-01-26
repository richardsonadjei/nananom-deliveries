import React, { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup, Row, Col } from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaMoneyBill, FaStickyNote, FaWallet } from "react-icons/fa";
import NewExpenseCategoryModal from "../finance/expensecategory";
import Select from "react-select";
import { useSelector } from "react-redux";

const ExpenseModal = ({ show, handleClose }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  const [categories, setCategories] = useState([]);
  const [motorbikes, setMotorbikes] = useState([]);
  const [selectedMotorbike, setSelectedMotorbike] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [payPeriodStart, setPayPeriodStart] = useState("");
  const [payPeriodEnd, setPayPeriodEnd] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [otherBenefits, setOtherBenefits] = useState([{ category: "", amount: "" }]);
  const [deductions, setDeductions] = useState([{ category: "", amount: "" }]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentUser = useSelector((state) => state.user.currentUser?.userName || "");

  // Fetch expense categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/expense-categories");
        const data = await response.json();
        setCategories(
          data.map((category) => ({
            label: category.name,
            value: category._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching expense categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch motorbikes and filter based on the current user
  useEffect(() => {
    const fetchMotorbikes = async () => {
      try {
        const response = await fetch("/api/motorbikes");
        const data = await response.json();
        const filteredMotorbikes = data.filter((motorbike) => {
          if (currentUser === "Pinkrah") {
            return motorbike.registrationNumber === "M-24-VR 1084(Partnership)";
          } else if (currentUser === "Miller") {
            return motorbike.registrationNumber === "ABOBOYAA-BIKE 1";
          } else if (currentUser === "David") {
            return motorbike.registrationNumber !== "ABOBOYAA-BIKE 1";
          }
          return motorbike.registrationNumber !== "Unknown";
        });

        setMotorbikes(
          filteredMotorbikes.map((motorbike) => ({
            label: motorbike.registrationNumber,
            value: motorbike._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching motorbikes:", error);
      }
    };

    fetchMotorbikes();
  }, [currentUser]);

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("/api/employees");
        const data = await response.json();
        setEmployees(
          data.map((employee) => ({
            label: `${employee.firstName} ${employee.lastName}`,
            value: employee._id,
          }))
        );
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleOtherBenefitsChange = (index, field, value) => {
    const updatedBenefits = [...otherBenefits];
    updatedBenefits[index][field] = value;
    setOtherBenefits(updatedBenefits);
  };

  const addOtherBenefit = () => {
    setOtherBenefits([...otherBenefits, { category: "", amount: "" }]);
  };

  const handleDeductionsChange = (index, field, value) => {
    const updatedDeductions = [...deductions];
    updatedDeductions[index][field] = value;
    setDeductions(updatedDeductions);
  };

  const addDeduction = () => {
    setDeductions([...deductions, { category: "", amount: "" }]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const expenseData = {
      amount,
      category: category?.value || "",
      motorbike: selectedMotorbike?.value || "",
      paymentMethod,
      notes,
      date,
      time,
      recordedBy: currentUser,
      employee: category?.label === "Pay And Allowance" ? selectedEmployee?.value : null,
      payPeriodStart: category?.label === "Pay And Allowance" ? payPeriodStart : null,
      payPeriodEnd: category?.label === "Pay And Allowance" ? payPeriodEnd : null,
      baseSalary: category?.label === "Pay And Allowance" ? baseSalary : null,
      otherBenefits: category?.label === "Pay And Allowance" ? otherBenefits : [],
      deductions: category?.label === "Pay And Allowance" ? deductions : [],
    };

    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        throw new Error("Failed to save expense");
      }

      window.alert("Expense saved successfully!");
      handleClose();

      // Reset form fields
      setAmount("");
      setCategory(null);
      setSelectedMotorbike(null);
      setPaymentMethod("Cash");
      setNotes("");
      setDate(new Date().toISOString().split("T")[0]);
      setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setSelectedEmployee(null);
      setPayPeriodStart("");
      setPayPeriodEnd("");
      setBaseSalary("");
      setOtherBenefits([{ category: "", amount: "" }]);
      setDeductions([{ category: "", amount: "" }]);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Record Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={onSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="amount">
                  <Form.Label>Expense</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaMoneyBill />
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter Expense"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="category">
                  <Form.Label>Category</Form.Label>
                  <Select
                    value={category}
                    onChange={(selectedOption) => setCategory(selectedOption)}
                    options={categories}
                    isClearable
                    isSearchable
                    placeholder="Select Category"
                  />
                  <Button variant="link" className="p-0 mt-2" onClick={() => setShowCategoryModal(true)}>
                    Add New Category
                  </Button>
                </Form.Group>
              </Col>
            </Row>

            {/* Additional fields for Pay and Allowance */}
            {category?.label === "Pay And Allowance" && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="employee">
                      <Form.Label>Employee</Form.Label>
                      <Select
                        value={selectedEmployee}
                        onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
                        options={employees}
                        isClearable
                        isSearchable
                        placeholder="Select Employee"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="baseSalary">
                      <Form.Label>Base Salary</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Base Salary"
                        value={baseSalary}
                        onChange={(e) => setBaseSalary(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group controlId="payPeriodStart">
                      <Form.Label>Pay Period Start</Form.Label>
                      <Form.Control
                        type="date"
                        value={payPeriodStart}
                        onChange={(e) => setPayPeriodStart(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="payPeriodEnd">
                      <Form.Label>Pay Period End</Form.Label>
                      <Form.Control
                        type="date"
                        value={payPeriodEnd}
                        onChange={(e) => setPayPeriodEnd(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Other Benefits */}
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="otherBenefits">
                      <Form.Label>Other Benefits</Form.Label>
                      {otherBenefits.map((benefit, index) => (
                        <Row key={index} className="mb-2">
                          <Col md={6}>
                            <Form.Control
                              type="text"
                              placeholder="Benefit Category"
                              value={benefit.category}
                              onChange={(e) => handleOtherBenefitsChange(index, "category", e.target.value)}
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Control
                              type="number"
                              placeholder="Amount"
                              value={benefit.amount}
                              onChange={(e) => handleOtherBenefitsChange(index, "amount", e.target.value)}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Button variant="link" onClick={addOtherBenefit}>
                        Add Another Benefit
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Deductions */}
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="deductions">
                      <Form.Label>Deductions</Form.Label>
                      {deductions.map((deduction, index) => (
                        <Row key={index} className="mb-2">
                          <Col md={6}>
                            <Form.Control
                              type="text"
                              placeholder="Deduction Category"
                              value={deduction.category}
                              onChange={(e) => handleDeductionsChange(index, "category", e.target.value)}
                            />
                          </Col>
                          <Col md={6}>
                            <Form.Control
                              type="number"
                              placeholder="Amount"
                              value={deduction.amount}
                              onChange={(e) => handleDeductionsChange(index, "amount", e.target.value)}
                            />
                          </Col>
                        </Row>
                      ))}
                      <Button variant="link" onClick={addDeduction}>
                        Add Another Deduction
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}

            <Row>
              <Col md={6}>
                <Form.Group controlId="motorbike">
                  <Form.Label>Motorbike</Form.Label>
                  <Select
                    value={selectedMotorbike}
                    onChange={(selectedOption) => setSelectedMotorbike(selectedOption)}
                    options={motorbikes}
                    isClearable
                    isSearchable
                    placeholder="Select Motorbike"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="paymentMethod">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Control
                    as="select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    required
                  >
                    <option value="Cash">Cash</option>
                    <option value="Momo">Momo</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group controlId="date">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="time">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group controlId="recordedBy">
                  <Form.Label>Recorded By</Form.Label>
                  <Form.Control type="text" value={currentUser} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="notes" className="mt-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Optional"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4" disabled={loading}>
              {loading ? "Saving..." : "Save Expense"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <NewExpenseCategoryModal
        show={showCategoryModal}
        handleClose={() => setShowCategoryModal(false)}
        onCategoryCreated={(newCategory) => {
          setCategories((prev) => [
            ...prev,
            { label: newCategory.name, value: newCategory._id },
          ]);
          setCategory({ label: newCategory.name, value: newCategory._id });
        }}
      />
    </>
  );
};

export default ExpenseModal;
