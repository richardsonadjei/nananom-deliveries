import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Header() {
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
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/" className="text-dark">
              Home
            </Nav.Link>
          </Nav>
          <ul className="navbar-nav ml-auto">
            <Nav.Link as={Link} to="/sign-in" className="text-dark">
              Sign in
            </Nav.Link>
          </ul>
          <ul className="navbar-nav ml-auto">
            <Nav.Link as={Link} to="/sign-up" className="text-dark">
              Sign Up
            </Nav.Link>
          </ul>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
