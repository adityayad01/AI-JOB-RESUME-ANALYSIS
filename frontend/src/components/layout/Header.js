import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const SmartHireHeader = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">SmartHire</Navbar.Brand>
        <Navbar.Toggle aria-controls="smarthire-navbar-nav" />
        <Navbar.Collapse id="smarthire-navbar-nav">
          <Nav className="me-auto">
  {isAuthenticated && (
    <>
      <Nav.Link as={Link} to="/upload/resume">Upload Resume</Nav.Link>
      <Nav.Link as={Link} to="/jobs">AI Insights</Nav.Link>
      <Nav.Link as={Link} to="/myresumes">My Resumes</Nav.Link>
      <Nav.Link as={Link} to="/matches">My Matches</Nav.Link>
      <Nav.Link as={Link} to="/mock-interview">Mock Interview</Nav.Link>
    </>
  )}
</Nav>

          <Nav>
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/notifications">
                  Notifications <Badge bg="danger"></Badge>
                </Nav.Link>
                <NavDropdown title={user?.name || "User"} id="user-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  {user?.role === "admin" && (
                    <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default SmartHireHeader;
