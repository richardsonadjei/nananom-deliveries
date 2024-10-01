import React from 'react';
import { Navbar } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

const MainHeader = ({ toggleOffcanvasRight }) => {
  return (
    <Navbar bg="primary" variant="dark" className="custom-header">
      <Navbar.Brand href="/" style={{ marginLeft: '40px' }}>
        Nananom Deliveries
      </Navbar.Brand>
      <FaBars className="menu-icon" onClick={toggleOffcanvasRight} />
    </Navbar>
  );
};

export default MainHeader;
