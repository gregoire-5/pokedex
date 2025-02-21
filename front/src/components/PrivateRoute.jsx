import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Vérifie si l'utilisateur est connecté

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
