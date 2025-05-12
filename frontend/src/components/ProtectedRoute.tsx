import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('candidate' | 'employer')[];
}
type RoleType = 'candidate' | 'employer';
export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const role=localStorage.getItem("role")
  const token=localStorage.getItem("token")
  const location = useLocation();

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

if (allowedRoles && role && !allowedRoles.includes(role as RoleType)) {
  return <Navigate to="/" replace />;
}

  return <>{children}</>;
}; 