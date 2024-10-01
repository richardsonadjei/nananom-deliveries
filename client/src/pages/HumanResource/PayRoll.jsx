import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container } from 'reactstrap';
import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri';

const AllPayrollsReport = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  useEffect(() => {
    fetchPayrolls();
  }, []);

  const toggleEditModal = () => setEditModal(!editModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const fetchPayrolls = async () => {
    try {
      const response = await fetch('/api/payrolls');
      if (!response.ok) {
        throw new Error('Failed to fetch payrolls');
      }
      const data = await response.json();
      setPayrolls(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching payrolls:', error.message);
      setErrorMessage('Failed to fetch payrolls');
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleEdit = (payroll) => {
    setSelectedPayroll(payroll);
    toggleEditModal();
  };

  const handleDelete = async (payroll) => {
    try {
      const response = await fetch(`/api/payrolls/${payroll._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete payroll');
      }
      // Remove the deleted payroll from the state
      setPayrolls(payrolls.filter((p) => p._id !== payroll._id));
      // Close the delete modal
      toggleDeleteModal();
    } catch (error) {
      console.error('Error deleting payroll:', error.message);
      // Handle error message
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/payrolls/${selectedPayroll._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedPayroll),
      });
      if (!response.ok) {
        throw new Error('Failed to update payroll data');
      }
      const updatedPayroll = await response.json();
      // Update the local state with the updated payroll data
      const updatedPayrolls = payrolls.map((p) =>
        p._id === updatedPayroll._id ? updatedPayroll : p
      );
      setPayrolls(updatedPayrolls);
      // Close the edit modal after successful update
      toggleEditModal();
    } catch (error) {
      console.error('Error updating payroll:', error.message);
      // Handle error if failed to save changes
    }
  };

  return (
    <Container fluid>
      <h2 className="mt-4">All Payrolls</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee Name</th>
              <th>Pay Period Start</th>
              <th>Pay Period End</th>
              <th>Base Salary</th>
              <th>Other Benefits</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Payroll Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payrolls.map((payroll, index) => (
              <tr key={payroll._id}>
                <td>{index + 1}</td>
                <td>{`${payroll.employee.firstName} ${payroll.employee.lastName}`}</td>
                <td>{formatDate(payroll.payPeriodStart)}</td>
                <td>{formatDate(payroll.payPeriodEnd)}</td>
                <td>{payroll.baseSalary}</td>
                <td>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payroll.otherBenefits.map((benefit, idx) => (
                        <tr key={`benefit-${idx}`}>
                          <td>{benefit.category}</td>
                          <td>{benefit.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payroll.deductions.map((deduction, idx) => (
                        <tr key={`deduction-${idx}`}>
                          <td>{deduction.category}</td>
                          <td>{deduction.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
                <td>{payroll.netPay}</td>
                <td>{payroll.payrollNumber}</td>
                <td>
                  <RiPencilLine
                    color="blue"
                    size={24}
                    onClick={() => handleEdit(payroll)}
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                  />
                  <RiDeleteBinLine
                    color="red"
                    size={24}
                    onClick={() => {
                      setSelectedPayroll(payroll);
                      toggleDeleteModal();
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Payroll</ModalHeader>
        {selectedPayroll && (
          <ModalBody>
          {selectedPayroll && (
            <>
              <div className="form-group">
                <label htmlFor="editEmployee">Employee</label>
                <select
                  className="form-control"
                  id="editEmployee"
                  value={selectedPayroll.employee._id}
                  onChange={(e) => {
                    const employee = payrolls.find((payroll) => payroll.employee._id === e.target.value)?.employee;
                    setSelectedPayroll({ ...selectedPayroll, employee });
                  }}
                  disabled // Employee cannot be changed for an existing payroll
                >
                  <option value={selectedPayroll.employee._id}>
                    {`${selectedPayroll.employee.firstName} ${selectedPayroll.employee.lastName}`}
                  </option>
                </select>
              </div>
        
              <div className="form-group">
                <label htmlFor="editPayPeriodStart">Pay Period Start</label>
                <input
                  type="date"
                  className="form-control"
                  id="editPayPeriodStart"
                  value={new Date(selectedPayroll.payPeriodStart).toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSelectedPayroll({ ...selectedPayroll, payPeriodStart: e.target.value })
                  }
                />
              </div>
        
              <div className="form-group">
                <label htmlFor="editPayPeriodEnd">Pay Period End</label>
                <input
                  type="date"
                  className="form-control"
                  id="editPayPeriodEnd"
                  value={new Date(selectedPayroll.payPeriodEnd).toISOString().split('T')[0]}
                  onChange={(e) =>
                    setSelectedPayroll({ ...selectedPayroll, payPeriodEnd: e.target.value })
                  }
                />
              </div>
        
              <div className="form-group">
                <label htmlFor="editBaseSalary">Base Salary</label>
                <input
                  type="number"
                  className="form-control"
                  id="editBaseSalary"
                  value={selectedPayroll.baseSalary}
                  onChange={(e) =>
                    setSelectedPayroll({ ...selectedPayroll, baseSalary: parseFloat(e.target.value) })
                  }
                />
              </div>
        
              <div className="form-group">
                <label>Other Benefits</label>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.otherBenefits.map((benefit, idx) => (
                      <tr key={`edit-benefit-${idx}`}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={benefit.category}
                            onChange={(e) => {
                              const updatedBenefits = [...selectedPayroll.otherBenefits];
                              updatedBenefits[idx].category = e.target.value;
                              setSelectedPayroll({
                                ...selectedPayroll,
                                otherBenefits: updatedBenefits,
                              });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={benefit.amount}
                            onChange={(e) => {
                              const updatedBenefits = [...selectedPayroll.otherBenefits];
                              updatedBenefits[idx].amount = parseFloat(e.target.value);
                              setSelectedPayroll({
                                ...selectedPayroll,
                                otherBenefits: updatedBenefits,
                              });
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() =>
                            setSelectedPayroll({
                              ...selectedPayroll,
                              otherBenefits: [
                                ...selectedPayroll.otherBenefits,
                                { category: '', amount: 0 },
                              ],
                            })
                          }
                        >
                          Add Benefit
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
        
              <div className="form-group">
                <label>Deductions</label>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPayroll.deductions.map((deduction, idx) => (
                      <tr key={`edit-deduction-${idx}`}>
                        <td>
                          <input
                            type="text"
                            className="form-control"
                            value={deduction.category}
                            onChange={(e) => {
                              const updatedDeductions = [...selectedPayroll.deductions];
                              updatedDeductions[idx].category = e.target.value;
                              setSelectedPayroll({
                                ...selectedPayroll,
                                deductions: updatedDeductions,
                              });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            value={deduction.amount}
                            onChange={(e) => {
                              const updatedDeductions = [...selectedPayroll.deductions];
                              updatedDeductions[idx].amount = parseFloat(e.target.value);
                              setSelectedPayroll({
                                ...selectedPayroll,
                                deductions: updatedDeductions,
                              });
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() =>
                            setSelectedPayroll({
                              ...selectedPayroll,
                              deductions: [
                                ...selectedPayroll.deductions,
                                { category: '', amount: 0 },
                              ],
                            })
                          }
                        >
                          Add Deduction
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
        
              <div className="form-group">
                <label htmlFor="editNetPay">Net Pay</label>
                <input
                  type="number"
                  className="form-control"
                  id="editNetPay"
                  value={selectedPayroll.netPay}
                  onChange={(e) =>
                    setSelectedPayroll({ ...selectedPayroll, netPay: parseFloat(e.target.value) })
                  }
                  disabled // This field is calculated and should not be editable
                />
              </div>
            </>
          )}
        </ModalBody>
        
        )}
        <ModalFooter>
          <Button color="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
          <Button color="secondary" onClick={toggleEditModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Delete Payroll</ModalHeader>
        <ModalBody>Are you sure you want to delete this payroll?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => handleDelete(selectedPayroll)}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default AllPayrollsReport;
