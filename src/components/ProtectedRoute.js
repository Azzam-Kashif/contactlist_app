import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom'; // Outlet renders the child routes
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set to true if user is logged in, false otherwise
      setLoading(false); // Set loading to false once authentication state is known
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading state while checking authentication

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />; // Navigate to login if not authenticated
};

export default ProtectedRoute;
