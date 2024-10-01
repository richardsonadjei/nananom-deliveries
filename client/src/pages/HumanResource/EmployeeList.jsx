import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Container } from 'reactstrap';
import { RiPencilLine, RiDeleteBinLine } from 'react-icons/ri';

const AllEmployeesReport = () => {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  const toggleEditModal = () => setEditModal(!editModal);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      setEmployees(data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching employees:', error.message);
      setErrorMessage('Failed to fetch employees');
    }
  };

  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/positions');
      if (!response.ok) {
        throw new Error('Failed to fetch positions');
      }
      const data = await response.json();
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDurationOfEmployment = (duration) => {
    const { years, months, days } = duration;
    return `${years} years ${months} months ${days} days`;
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    toggleEditModal();
  };

  const handleDelete = async (employee) => {
    try {
      const response = await fetch(`/api/employees/${employee._id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      // Remove the deleted employee from the state
      setEmployees(employees.filter((emp) => emp._id !== employee._id));
      // Close the delete modal
      toggleDeleteModal();
    } catch (error) {
      console.error('Error deleting employee:', error.message);
      // Handle error message
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/employees/${selectedEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedEmployee),
      });
      if (!response.ok) {
        throw new Error('Failed to update employee data');
      }
      const updatedEmployee = await response.json();
      // Update the local state with the updated employee data
      const updatedEmployees = employees.map((emp) =>
        emp._id === updatedEmployee._id ? updatedEmployee : emp
      );
      setEmployees(updatedEmployees);
      // Close the edit modal after successful update
      toggleEditModal();
    } catch (error) {
      console.error('Error updating employee:', error.message);
      // Handle error if failed to save changes
    }
  };

  return (
    <Container fluid>
      <h2 className="mt-4">All Employees</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee ID</th>
              <th>Hire Date</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Phone Number</th>
              <th>Date of Birth</th>
              <th>Position</th>
              <th>Salary</th>
              <th>Duration of Employment</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={employee._id}>
                <td>{index + 1}</td>
                <td>{employee.employeeId}</td>
                <td>{formatDate(employee.hireDate)}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.phoneNumber}</td>
                <td>{formatDate(employee.dateOfBirth)}</td>
                <td>{employee.position}</td>
                <td>{employee.salary}</td>
                <td>{formatDurationOfEmployment(employee.durationOfEmployment)}</td>
                <td>{employee.isActive ? 'Yes' : 'No'}</td>
                <td>
                  <RiPencilLine
                    color="blue"
                    size={24}
                    onClick={() => handleEdit(employee)}
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                  />
                  <RiDeleteBinLine
                    color="red"
                    size={24}
                    onClick={() => {
                      setSelectedEmployee(employee);
                      toggleDeleteModal();
                    }}
                    style={{ cursor: 'pointer', marginRight: '10px' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="12" style={{ fontWeight: 'bold', color: 'purple' }}>
                Total Employees: {employees.length}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Employee</ModalHeader>
        {selectedEmployee && (
          <form>
            <div className="form-group">
              <label htmlFor="editFirstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="editFirstName"
                value={selectedEmployee.firstName}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, firstName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="editLastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="editLastName"
                value={selectedEmployee.lastName}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, lastName: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="editPhoneNumber">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="editPhoneNumber"
                value={selectedEmployee.phoneNumber}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, phoneNumber: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="editDateOfBirth">Date of Birth</label>
              <input
                type="text"
                className="form-control"
                id="editDateOfBirth"
                value={formatDate(selectedEmployee.dateOfBirth)}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="editPosition">Position</label>
              <select
                className="form-control"
                id="editPosition"
                value={selectedEmployee.position}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, position: e.target.value })
                }
              >
                {positions.map((pos) => (
                  <option key={pos._id} value={pos.title}>
                    {pos.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="editHireDate">Hire Date</label>
              <input
                type="text"
                className="form-control"
                id="editHireDate"
                value={formatDate(selectedEmployee.hireDate)}
                disabled
              />
            </div>
            <div className="form-group">
              <label htmlFor="editSalary">Salary</label>
              <input
                type="text"
                className="form-control"
                id="editSalary"
                value={selectedEmployee.salary}
                onChange={(e) =>
                  setSelectedEmployee({ ...selectedEmployee, salary: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="editIsActive">Active</label>
              <select
                className="form-control"
                id="editIsActive"
                value={selectedEmployee.isActive}
                onChange={(e) =>
                    setSelectedEmployee({ ...selectedEmployee, isActive: e.target.value === 'true' })
                  }
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Duration of Employment</label>
                <input
                  type="text"
                  className="form-control"
                  value={formatDurationOfEmployment(selectedEmployee.durationOfEmployment)}
                  disabled
                />
              </div>
              <div className="form-group">
                <label>Employee ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEmployee.employeeId}
                  disabled
                />
              </div>
            </form>
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
          <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this employee?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => handleDelete(selectedEmployee)}>
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
  
  export default AllEmployeesReport;
  
