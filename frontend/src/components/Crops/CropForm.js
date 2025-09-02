import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/crops';
import { farmerService } from '../../services/farmer';

const CropForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: '',
    farmer_id: ''
  });
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (isAdmin) {
          const farmersData = await farmerService.getAll();
          setFarmers(farmersData);
        }
        
        if (isEdit) {
          const crop = await cropService.getById(id);
          setFormData({
            name: crop.name,
            type: crop.type,
            quantity: crop.quantity,
            farmer_id: crop.farmer_id
          });
        }
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEdit, isAdmin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    setSubmitting(true);
    
    try {
      if (isEdit) {
        await cropService.update(id, formData);
      } else {
        await cropService.create(formData);
      }
      navigate('/crops');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save crop');
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
      <h2 className="mb-4">{isEdit ? 'Edit Crop' : 'Add New Crop'}</h2>
      
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
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>
            
            {isAdmin && (
              <Form.Group className="mb-3">
                <Form.Label>Farmer</Form.Label>
                <Form.Select
                  name="farmer_id"
                  value={formData.farmer_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Farmer</option>
                  {farmers.map(farmer => (
                    <option key={farmer.id} value={farmer.id}>
                      {farmer.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            )}
            
            <Button 
              type="submit" 
              variant="primary" 
              disabled={submitting}
            >
              {submitting ? 'Saving...' : (isEdit ? 'Update Crop' : 'Add Crop')}
            </Button>
            
            <Button 
              variant="outline-secondary" 
              className="ms-2"
              onClick={() => navigate('/crops')}
            >
              Cancel
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CropForm;