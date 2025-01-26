import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return `${formatDate(firstDayOfMonth)} - ${formatDate(lastDayOfMonth)}`;
};

const getCurrentWeekRange = () => {
  const now = new Date();
  const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return `${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}`;
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

const groupByMotorbike = (transactions, allMotorbikes) => {
  const grouped = {};
  transactions.forEach((transaction) => {
    const motorbike = transaction.motorbike?.registrationNumber || "Unknown";
    if (!grouped[motorbike]) {
      grouped[motorbike] = { incomes: [], expenses: [] };
    }
    if (transaction.transactionType === "Income") {
      grouped[motorbike].incomes.push(transaction);
    } else if (transaction.transactionType === "Expense") {
      grouped[motorbike].expenses.push(transaction);
    }
  });

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
  const [expandedCard, setExpandedCard] = useState(null);
  const currentUser = useSelector((state) => state.user.currentUser?.userName || "");

  const fetchData = async () => {
    try {
      const motorbikeResponse = await fetch("/api/motorbikes");
      const motorbikes = await motorbikeResponse.json();
      setAllMotorbikes(motorbikes);

      const transactionResponse = await fetch("/api/incomes-expenses");
      const data = await transactionResponse.json();

      if (!data || (!data.incomes && !data.expenses)) {
        console.error("Invalid data structure", data);
        return;
      }

      const incomes = data.incomes || [];
      const expenses = data.expenses || [];
      const incomeTransactions = incomes.map((income) => ({
        ...income,
        transactionType: "Income",
      }));
      const expenseTransactions = expenses.map((expense) => ({
        ...expense,
        transactionType: "Expense",
      }));
      const allTransactions = [...incomeTransactions, ...expenseTransactions];
      const groupedMotorbikeData = groupByMotorbike(allTransactions, motorbikes);
      setMotorbikeData(groupedMotorbikeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 100000);
    return () => clearInterval(intervalId);
  }, []);

  const calculateTotal = (transactions, filterFunction) => {
    return transactions
      .filter((transaction) => filterFunction(new Date(transaction.date)))
      .reduce((acc, transaction) => acc + transaction.amount, 0);
  };

  const toggleCard = (motorbike) => {
    setExpandedCard((prev) => (prev === motorbike ? null : motorbike));
  };

  return (
    <div className="balance-summary">
      <Row className="justify-content-center">
        {Object.keys(motorbikeData)
          .filter((motorbike) => {
            if (currentUser === "Pinkrah") {
              return motorbike === "M-24-VR 1084(Partnership)";
            } else if (currentUser === "Miller") {
              return motorbike === "ABOBOYAA-BIKE 1";
            } else if (currentUser === "David") {
              return motorbike !== "ABOBOYAA-BIKE 1";
            }
            return motorbike !== "Unknown";
          })
          .map((motorbike, index) => {
            const incomes = motorbikeData[motorbike].incomes;
            const expenses = motorbikeData[motorbike].expenses;
            const totalIncomeWeek = calculateTotal(incomes, isDateInCurrentWeek);
            const totalExpenseWeek = calculateTotal(expenses, isDateInCurrentWeek);
            const totalIncomeMonth = calculateTotal(incomes, isDateInCurrentMonth);
            const totalExpenseMonth = calculateTotal(expenses, isDateInCurrentMonth);
            const isExpanded = expandedCard === motorbike;

            return (
              <Col xs={12} md={6} className="mb-4" key={index}>
                <div
                  className={`summary-card ${isExpanded ? "expanded" : "minimized"}`}
                  onClick={() => toggleCard(motorbike)}
                >
                  <div className="summary-header">
                    <h5>{motorbike}</h5>
                    {!isExpanded && <span>Click to Expand</span>}
                  </div>

                  {isExpanded && (
                    <div className="summary-content">
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
                  )}
                </div>
              </Col>
            );
          })}
      </Row>
    </div>
  );
};

export default BalanceSummary;
