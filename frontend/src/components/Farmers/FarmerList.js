import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { farmerService } from '../../services/farmer';

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await farmerService.getAll();
        setFarmers(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load farmers');
        setLoading(false);
      }
    };

    fetchFarmers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this farmer?')) {
      try {
        await farmerService.delete(id);
        setFarmers(farmers.filter(farmer => farmer.id !== id));
      } catch (error) {
        setError('Failed to delete farmer');
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
        <h2>Farmer Management</h2>
        <Button as={Link} to="/farmers/new" variant="primary">
          Add New Farmer
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
                <th>Email</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map(farmer => (
                <tr key={farmer.id}>
                  <td>{farmer.id}</td>
                  <td>{farmer.name}</td>
                  <td>{farmer.email}</td>
                  <td>{new Date(farmer.created_at).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      as={Link} 
                      to={`/farmers/edit/${farmer.id}`} 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(farmer.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {farmers.length === 0 && (
            <div className="text-center text-muted py-4">
              No farmers found
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default FarmerList;