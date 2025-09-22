import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div>
      <h1 className="mb-4">Admin Dashboard</h1>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="h-100 text-center">
            <Card.Body>
              <FaUsers className="display-4 text-primary mb-3" />
              <Card.Title>User Management</Card.Title>
              <Card.Text>
                Manage SmartHire users and assign roles.
              </Card.Text>
              <Link to="/admin/users" className="btn btn-primary">
                Manage Users
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
