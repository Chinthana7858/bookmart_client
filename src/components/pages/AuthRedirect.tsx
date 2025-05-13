import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

export default function AuthRedirect() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // wait for auth check to finish

    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "user") {
        navigate("/home");
      } else {
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  return <p>Loading...</p>; // Optional: add spinner here
}
