import axios from "axios";
import Navbar from "../templates/Navbar";
import { useState } from "react";
import type { SignInFormData } from "../../types/user";
import { useNavigate } from "react-router-dom";
import AlertModal from "../UI/molecules/modals/AlertModal";
import API from "../../const/api_paths";
import { useAuth } from "../../AuthContext";
import { IoEyeOff, IoEye } from "react-icons/io5";

export default function SignIn() {
  const { setUser } = useAuth();
  const [form, setForm] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [signinfailed, setSigninfailed] = useState(false);
  const [signinerror, setSigninerror] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(API.LOGIN, form, {
        withCredentials: true,
      });
      const res = await axios.get(API.AUTHENTICATE, {
        withCredentials: true,
      });
      setUser(res.data);

      console.log("Signin successful:", response.data);
      navigate("/authredirect");
    } catch (error: any) {
      console.error("Signin failed:", error);
      setSigninerror(error?.response?.data?.detail || "Something went wrong.");
      setSigninfailed(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <Navbar />
      <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-dark">
            Log in
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />

          <div className="relative pb-4">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-primary text-sm px-4 py-2"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
              tabIndex={-1}
            >
              {!showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full bg-primary text-white py-2 rounded transition  ${
              loading
                ? " cursor-not-allowed"
                : "cursor-pointer hover:bg-primarydark "
            }`}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center mt-4">
            <a
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Create an account
            </a>
          </div>
        </form>
      </div>
      <AlertModal
        isOpen={signinfailed}
        title="Failed"
        message={`Signin failed: ${signinerror}`}
        onClose={() => setSigninfailed(false)}
        type="error"
      />
    </div>
  );
}
