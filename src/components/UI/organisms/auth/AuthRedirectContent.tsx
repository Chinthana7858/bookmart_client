import { Navigate } from "react-router-dom";
import { useAuth } from "../../../../auth";
import LoadingSpinner from "../../atoms/LoadingSpinner";

export default function AuthRedirect() {
  const { user, loading } = useAuth();
  const role = user?.role?.trim().toLowerCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-light py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) return <Navigate to="/signin" replace />;
  if (role === "admin") return <Navigate to="/admin/dashboard" replace />;

  return <Navigate to="/home" replace />;
}
