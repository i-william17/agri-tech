import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { farmerService } from '../../services/farmer';

const FarmerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchFarmer = async () => {
        try {
          setLoading(true);
          const farmer = await farmerService.getById(id);
          setFormData({
            name: farmer.name,
            email: farmer.email,
            password: '',
            confirmPassword: ''
          });
          setLoading(false);
        } catch (error) {
          setError('Failed to load farmer data');
          setLoading(false);
        }
      };

      fetchFarmer();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isEdit && !formData.password && !formData.confirmPassword) {
      // If editing and passwords are empty, remove them from the data
      delete formData.password;
      delete formData.confirmPassword;
    } else if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setSubmitting(true);
    
    try {
      if (isEdit) {
        await farmerService.update(id, formData);
      } else {
        await farmerService.create(formData);
      }
      navigate('/farmers');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save farmer');
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">{isEdit ? 'Edit Farmer' : 'Add New Farmer'}</h2>
      
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
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
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEdit}
                placeholder={isEdit ? 'Leave blank to keep current password' : ''}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isEdit}
                placeholder={isEdit ? 'Leave blank to keep current password' : ''}
              />
            </Form.Group>
            
            <Button 
              type="submit" 
              variant="primary" 
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEdit ? 'Update Farmer' : 'Add Farmer')}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              className="ms-2"
              onClick={() => navigate('/farmers')}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FarmerForm;