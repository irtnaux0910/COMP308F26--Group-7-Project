import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './modules/auth/components/LoginForm';
import ResidentDashboard from './modules/resident/views/ResidentDashboard';
import StaffDashboard from './modules/staff/views/StaffDashboard';

export default function App() {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/resident" /> : <LoginForm />} 
      />
      
      <Route 
        path="/resident" 
        element={isAuthenticated ? <ResidentDashboard /> : <Navigate to="/" />} 
      />

      <Route 
        path="/staff" 
        element={isAuthenticated ? <StaffDashboard /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}