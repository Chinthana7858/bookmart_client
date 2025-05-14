
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import type { JSX } from "react";
import LoadingSpinner from "../UI/atoms/LoadingSpinner";

export default function AdminRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return <div><LoadingSpinner /></div>;
  if (!user || user.role !== "admin") return <Navigate to="/signin" replace />;

  return children;
}
