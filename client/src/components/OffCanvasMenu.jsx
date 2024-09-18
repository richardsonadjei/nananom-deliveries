import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Offcanvas, Nav, Dropdown } from 'react-bootstrap';
import { FaBell, FaHome, FaUser, FaSignOutAlt, FaSignInAlt, FaPlus, FaEllipsisV } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AddBikeModal from '../pages/extras/AddNewBikeModal';
import NewExpenseCategoryModal from '../pages/finance/expensecategory';


const OffcanvasMenu = ({ showOffcanvasRight, handleClose, handleItemClick }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [showAddBikeModal, setShowAddBikeModal] = useState(false);
  const [showExpenseCategoryModal, setShowExpenseCategoryModal] = useState(false); // State for Expense Category Modal

  const handleAddBikeClick = () => {
    setShowAddBikeModal(true);
    handleClose(); // Close the offcanvas menu
  };

  const handleAddBikeModalClose = () => {
    setShowAddBikeModal(false);
  };

  const handleAddExpenseCategoryClick = () => {
    setShowExpenseCategoryModal(true);
    handleClose(); // Close the offcanvas menu
  };

  const handleExpenseCategoryModalClose = () => {
    setShowExpenseCategoryModal(false);
  };

  return (
    <>
      <Offcanvas show={showOffcanvasRight} onHide={handleClose} placement="end" className="custom-offcanvas">
        <Offcanvas.Header closeButton className="offcanvas-header-custom">
          <Offcanvas.Title className="offcanvas-title-custom">Nananom Deliveries</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleItemClick} className="nav-link-custom">
              <FaHome /> Home
            </Nav.Link>

            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile" onClick={handleItemClick} className="nav-link-custom">
                  <FaUser /> <span>{currentUser.userName}</span>
                </Nav.Link>

                <Nav.Link as={Link} to="/sign-out" onClick={handleItemClick} className="nav-link-custom">
                  <FaSignOutAlt /> Sign Out
                </Nav.Link>

                {currentUser.role === 'ceo' && (
                  <Nav.Link as={Link} to="/sign-up" onClick={handleItemClick} className="nav-link-custom">
                    <FaPlus /> Create New User
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/sign-in" onClick={handleItemClick} className="nav-link-custom">
                  <FaSignInAlt /> Sign In
                </Nav.Link>

                {(!currentUser || (currentUser?.role !== 'employee' && currentUser?.role !== 'manager')) && (
                  <Nav.Link as={Link} to="/sign-up" onClick={handleItemClick} className="nav-link-custom">
                    <FaPlus /> Create New User
                  </Nav.Link>
                )}
              </>
            )}

            {/* Dropdown for Others */}
            <Dropdown className="mt-3">
              <Dropdown.Toggle variant="link" id="dropdown-others" className="nav-link-custom">
                <FaEllipsisV /> Others
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleAddExpenseCategoryClick}>Add Expense Category</Dropdown.Item>
                <Dropdown.Item onClick={handleAddBikeClick}>Add New Bike</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Add the AddBikeModal component */}
      <AddBikeModal show={showAddBikeModal} handleClose={handleAddBikeModalClose} />

      {/* Add the NewExpenseCategoryModal component */}
      <NewExpenseCategoryModal show={showExpenseCategoryModal} handleClose={handleExpenseCategoryModalClose} />
    </>
  );
};

export default OffcanvasMenu;
