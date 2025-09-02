import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg" className="border-bottom">
      <Navbar.Brand className="ms-3">AgTech ERP</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
        <Nav className="me-3">
          <Nav.Item className="d-flex align-items-center me-3">
            Welcome, {currentUser?.name} ({currentUser?.role})
          </Nav.Item>
          <Button variant="outline-danger" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;