import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen label="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const targetRedirect =
      user?.role === 'Employee'
        ? '/employee/dashboard'
        : user?.role === 'Super Admin'
        ? '/super-admin/dashboard'
        : '/dashboard';
    return <Navigate to={targetRedirect} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
