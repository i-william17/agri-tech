import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { cropService } from '../../services/crops';
import CropsByType from '../Charts/CropsByType';

const FarmerDashboard = () => {
  const [stats, setStats] = useState({
    crops: 0,
    loading: true,
    error: null
  });
  const [cropStats, setCropStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crops, cropsByType] = await Promise.all([
          cropService.getAll(),
          cropService.getByType()
        ]);
        
        setStats({
          crops: crops.length,
          loading: false,
          error: null
        });
        
        setCropStats(cropsByType);
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
      <h2 className="mb-4">Farmer Dashboard</h2>
      
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>My Crops</Card.Title>
              <Card.Text className="display-4">{stats.crops}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>My Crops by Type</Card.Title>
              <CropsByType data={cropStats} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default FarmerDashboard;