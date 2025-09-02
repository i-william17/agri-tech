import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cropService } from '../../services/crops';

const CropList = () => {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await cropService.getAll();
        setCrops(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load crops');
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this crop?')) {
      try {
        await cropService.delete(id);
        setCrops(crops.filter(crop => crop.id !== id));
      } catch (error) {
        setError('Failed to delete crop');
      }
    }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Crop Management</h2>
        <Button as={Link} to="/crops/new" variant="primary">
          Add New Crop
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                {isAdmin && <th>Farmer</th>}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crops.map(crop => (
                <tr key={crop.id}>
                  <td>{crop.id}</td>
                  <td>{crop.name}</td>
                  <td>
                    <Badge bg="info">{crop.type}</Badge>
                  </td>
                  <td>{crop.quantity}</td>
                  {isAdmin && <td>{crop.farmer_name}</td>}
                  <td>
                    <Button 
                      as={Link} 
                      to={`/crops/edit/${crop.id}`} 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(crop.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {crops.length === 0 && (
            <div className="text-center text-muted py-4">
              No crops found
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default CropList;