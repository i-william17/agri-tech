import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  return (
    <div className="bg-dark text-white" style={{ width: '250px' }}>
      <div className="p-3 border-bottom">
        <h5 className="mb-0"></h5>
      </div>
      <Nav className="flex-column p-3">
        <Nav.Link 
          as={Link} 
          to="/dashboard" 
          className={`text-white mb-2 ${location.pathname === '/dashboard' ? 'bg-primary rounded' : ''}`}
        >
          Dashboard
        </Nav.Link>
        
        {isAdmin && (
          <>
            <div className="text-muted small mt-3 mb-1">Admin</div>
            <Nav.Link 
              as={Link} 
              to="/farmers" 
              className={`text-white mb-2 ${location.pathname.startsWith('/farmers') ? 'bg-primary rounded' : ''}`}
            >
              Farmer Management
            </Nav.Link>
          </>
        )}
        
        <div className="text-muted small mt-3 mb-1">Management</div>
        <Nav.Link 
          as={Link} 
          to="/crops" 
          className={`text-white mb-2 ${location.pathname.startsWith('/crops') ? 'bg-primary rounded' : ''}`}
        >
          Crop Management
        </Nav.Link>
        
        <Nav.Link 
          as={Link} 
          to="/profile" 
          className={`text-white mb-2 ${location.pathname === '/profile' ? 'bg-primary rounded' : ''}`}
        >
          My Profile
        </Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;