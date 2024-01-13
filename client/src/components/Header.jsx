import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Link to="/">
          <Navbar.Brand>
            <img
              src="../../public/logo.png" // Replace with the actual path to your logo
              alt="Logo"
              className="logo"
            />
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="ml-auto">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/" className="text-dark">
              Home
            </Nav.Link>
          </Nav>
          <Nav>
            {currentUser ? (
              <>
                <Nav.Link as={Link} to="/profile" className="text-dark">
                  {currentUser.userName}
                </Nav.Link>
                <Nav.Link as={Link} to="/sign-out" className="text-dark">
                  Sign Out
                </Nav.Link>
                {currentUser.role === 'ceo' && (
                  <Nav.Link as={Link} to="/sign-up" className="text-dark">
                    Create User
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/sign-in" className="text-dark">
                  Sign In
                </Nav.Link>
                {/* Show "Sign Up" only if the role is not "employee" or "manager" */}
                {currentUser?.role !== 'employee' && currentUser?.role !== 'manager' && (
                  <Nav.Link as={Link} to="/sign-up" className="text-dark">
                    Create User
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/profile" className="text-dark">
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
