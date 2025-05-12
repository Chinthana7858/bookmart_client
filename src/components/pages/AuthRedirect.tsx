import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../../const/api_paths";
import { setUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";

export default function AuthRedirect() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(API.AUTHENTICATE, { withCredentials: true })
      .then((res) => {
        const userData = res.data;
        dispatch(setUser(userData));
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else if (userData.role === "user") {
          navigate("/home");
        } else {
          navigate("/signin");
        }
      })
      .catch(() => {
        navigate("/signin");
      });
  }, [navigate, dispatch]);

  return <p>Loading...</p>;
}
