// src/components/PrivateRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/Auth';

export default function PrivateRoute() {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
}
