import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { cropService } from '../../services/crops';
import { farmerService } from '../../services/farmer';
import CropsPerFarmer from '../Charts/CropsPerFarmer';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    farmers: 0,
    crops: 0,
    loading: true,
    error: null
  });
  const [cropStats, setCropStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmers, crops, cropsStats] = await Promise.all([
          farmerService.getAll(),
          cropService.getAll(),
          cropService.getStats()
        ]);
        
        setStats({
          farmers: farmers.length,
          crops: crops.length,
          loading: false,
          error: null
        });
        
        setCropStats(cropsStats);
      } catch (error) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load dashboard data'
        }));
      }
    };

    fetchData();
  }, []);

  if (stats.loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (stats.error) {
    return <Alert variant="danger">{stats.error}</Alert>;
  }

  return (
    <div>
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Total Farmers</Card.Title>
              <Card.Text className="display-4">{stats.farmers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>Total Crops</Card.Title>
              <Card.Text className="display-4">{stats.crops}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Crops per Farmer</Card.Title>
              <CropsPerFarmer data={cropStats} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;