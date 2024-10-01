import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Offcanvas, Nav, Dropdown } from 'react-bootstrap';
import { FaBell, FaHome, FaUser, FaSignOutAlt, FaSignInAlt, FaPlus, FaEllipsisV, FaUsers, FaList } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AddBikeModal from '../pages/extras/AddNewBikeModal';
import NewExpenseCategoryModal from '../pages/finance/expensecategory';
import RegisterEmployeeModal from '../pages/HumanResource/NewEmployeeModal';


const OffcanvasMenu = ({ showOffcanvasRight, handleClose, handleItemClick }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [showAddBikeModal, setShowAddBikeModal] = useState(false);
  const [showExpenseCategoryModal, setShowExpenseCategoryModal] = useState(false);
  const [showRegisterEmployeeModal, setShowRegisterEmployeeModal] = useState(false);

  const handleAddBikeClick = () => {
    setShowAddBikeModal(true);
    handleClose();
  };

  const handleAddBikeModalClose = () => {
    setShowAddBikeModal(false);
  };

  const handleAddExpenseCategoryClick = () => {
    setShowExpenseCategoryModal(true);
    handleClose();
  };

  const handleExpenseCategoryModalClose = () => {
    setShowExpenseCategoryModal(false);
  };

  const handleAddEmployeeClick = () => {
    setShowRegisterEmployeeModal(true);
    handleClose();
  };

  const handleRegisterEmployeeModalClose = () => {
    setShowRegisterEmployeeModal(false);
  };

  return (
    <>
      <Offcanvas show={showOffcanvasRight} onHide={handleClose} placement="end" className="custom-offcanvas">
        <Offcanvas.Header closeButton className="offcanvas-header-new">
          <Offcanvas.Title className="offcanvas-title-new">Nananom Deliveries</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleItemClick} className="nav-link-new">
              <FaHome /> Home
            </Nav.Link>

            {/* Dropdown for Human Resource */}
            <Dropdown className="mt-3">
              <Dropdown.Toggle variant="link" id="dropdown-hr" className="dropdown-toggle-new nav-link-new no-underline">
                <FaUsers /> Human Resource
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-new">
                <Dropdown.Item onClick={handleAddEmployeeClick} className="dropdown-item-new">
                  Add New Employee
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/employee-list" onClick={handleItemClick} className="dropdown-item-new">
                  Employee List
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/payrolls" onClick={handleItemClick} className="dropdown-item-new">
                  View PayRoll
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Dropdown for Others */}
            <Dropdown className="mt-3">
              <Dropdown.Toggle variant="link" id="dropdown-others" className="dropdown-toggle-new nav-link-new no-underline">
                <FaEllipsisV /> Others
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-new">
                <Dropdown.Item onClick={handleAddExpenseCategoryClick} className="dropdown-item-new">Add Expense Category</Dropdown.Item>
                <Dropdown.Item onClick={handleAddBikeClick} className="dropdown-item-new">Add New Bike</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile" onClick={handleItemClick} className="nav-link-new">
                  <FaUser /> <span>{currentUser.userName}</span>
                </Nav.Link>

                <Nav.Link as={Link} to="/sign-out" onClick={handleItemClick} className="nav-link-new">
                  <FaSignOutAlt /> Sign Out
                </Nav.Link>

                {currentUser.role === 'ceo' && (
                  <Nav.Link as={Link} to="/sign-up" onClick={handleItemClick} className="nav-link-new">
                    <FaPlus /> Create New User
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/sign-in" onClick={handleItemClick} className="nav-link-new">
                  <FaSignInAlt /> Sign In
                </Nav.Link>

                {(!currentUser || (currentUser?.role !== 'employee' && currentUser?.role !== 'manager')) && (
                  <Nav.Link as={Link} to="/sign-up" onClick={handleItemClick} className="nav-link-new">
                    <FaPlus /> Create New User
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Modals */}
      <AddBikeModal show={showAddBikeModal} handleClose={handleAddBikeModalClose} />
      <NewExpenseCategoryModal show={showExpenseCategoryModal} handleClose={handleExpenseCategoryModalClose} />
      <RegisterEmployeeModal isOpen={showRegisterEmployeeModal} toggle={handleRegisterEmployeeModalClose} />
    </>
  );
};

export default OffcanvasMenu;
