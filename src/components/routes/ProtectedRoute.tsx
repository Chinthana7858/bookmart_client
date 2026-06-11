
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth";
import type { JSX } from "react";
import LoadingSpinner from "../UI/atoms/LoadingSpinner";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-light py-16">
        <LoadingSpinner />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return children;
}
