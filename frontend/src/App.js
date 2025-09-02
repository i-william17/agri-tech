import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import FarmerDashboard from './components/Dashboard/FarmerDashboard';
import FarmerList from './components/Farmers/FarmerList';
import FarmerForm from './components/Farmers/FarmerForm';
import FarmerProfile from './components/Farmers/FarmerProfile';
import CropList from './components/Crops/CropList';
import CropForm from './components/Crops/CropForm';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// App Routes
const AppRoutes = () => {
  const { isAdmin } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            {isAdmin ? <AdminDashboard /> : <FarmerDashboard />}
          </ProtectedRoute>
        } />
        
        {/* Admin-only Routes */}
        <Route path="farmers" element={
          <ProtectedRoute adminOnly={true}>
            <FarmerList />
          </ProtectedRoute>
        } />
        <Route path="farmers/new" element={
          <ProtectedRoute adminOnly={true}>
            <FarmerForm />
          </ProtectedRoute>
        } />
        <Route path="farmers/edit/:id" element={
          <ProtectedRoute adminOnly={true}>
            <FarmerForm />
          </ProtectedRoute>
        } />
        
        {/* Farmer Profile (accessible by both, but farmers can only see their own) */}
        <Route path="profile" element={
          <ProtectedRoute>
            <FarmerProfile />
          </ProtectedRoute>
        } />
        
        {/* Crop Routes */}
        <Route path="crops" element={
          <ProtectedRoute>
            <CropList />
          </ProtectedRoute>
        } />
        <Route path="crops/new" element={
          <ProtectedRoute>
            <CropForm />
          </ProtectedRoute>
        } />
        <Route path="crops/edit/:id" element={
          <ProtectedRoute>
            <CropForm />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;