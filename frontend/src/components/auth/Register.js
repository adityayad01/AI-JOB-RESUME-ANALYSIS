import React, { useContext, useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordConfirm) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      const userData = {
        ...formData,
        role: 'student' // assigned by backend
      };

      const success = await register(userData);
      if (success) {
        navigate('/login');
      } else {
        setError('Failed to create an account');
      }
    } catch (err) {
      setError('Failed to create an account');
    }

    setLoading(false);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div className="w-100" style={{ maxWidth: '700px' }}> {/* increased width */}
        <Card style={{ padding: '35px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <Card.Body>
            <h2 className="text-center mb-4">SmartHire - Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </Form.Group>

              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group id="password" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter password"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group id="passwordConfirm" className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      required
                      placeholder="Confirm password"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button disabled={loading} className="w-100 mt-3" type="submit">
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <div className="w-100 text-center mt-3">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
