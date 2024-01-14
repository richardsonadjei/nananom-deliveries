import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute (60,000 milliseconds)

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <Navbar bg="light" expand="lg" className="custom-navbar">
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

        {/* Date and time at the center of the vw */}
        <div className="current-date-time">
      {currentDateTime.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}
    </div>

        <Navbar.Collapse id="basic-navbar-nav" className="ml-auto">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/"  className="text-white">
              Home
            </Nav.Link>
          </Nav>

          <Nav>
            {currentUser ? (
              <>
               <Nav.Link as={Link} to="/profile"  className="text-white">
  <span>{currentUser.userName}</span>
</Nav.Link>

                <Nav.Link as={Link} to="/sign-out"  className="text-white">
                  Sign Out
                </Nav.Link>
                {currentUser.role === 'ceo' && (
                  <Nav.Link as={Link} to="/sign-up"  className="text-white">
                    Create New User
                  </Nav.Link>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/sign-in"  className="text-white">
                  Sign In
                </Nav.Link>
                {/* Show "Sign Up" only if the role is not "employee" or "manager" */}
                {currentUser?.role !== 'employee' && currentUser?.role !== 'manager' && (
                  <Nav.Link as={Link} to="/sign-up" className="text-dark">
                    Create New User
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
