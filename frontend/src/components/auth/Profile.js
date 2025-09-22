import React, { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    createdAt: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'student',
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await updateProfile({ name: formData.name }); // token handled in context
      if (res) {
        setSuccess('Profile updated successfully');
        toast.success('Profile updated successfully');
      } else {
        setError('Error updating profile');
        toast.error('Error updating profile');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating profile');
      toast.error(err.response?.data?.error || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">My Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
                <Form.Text className="text-muted">
                  Email cannot be changed
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control type="text" value={formData.role} disabled />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Account Created On</Form.Label>
                <Form.Control type="text" value={formData.createdAt} disabled />
              </Form.Group>

              <div className="d-grid gap-2 mt-4">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
