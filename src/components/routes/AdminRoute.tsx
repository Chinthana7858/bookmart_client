import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../auth";
import type { JSX } from "react";
import LoadingSpinner from "../UI/atoms/LoadingSpinner";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const role = user?.role?.trim().toLowerCase();

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
  if (role !== "admin") return <Navigate to="/home" replace />;

  return children;
}
