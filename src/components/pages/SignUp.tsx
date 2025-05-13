import { useState } from "react";
import Navbar from "../templates/Navbar";
import axios from "axios";
import API from "../../const/api_paths";
import type { SignUpFormData } from "../../types/user";
import AlertModal from "../UI/molecules/modals/AlertModal";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user",
  });
  const [passwordError, setPasswordError] = useState("");
  const [signupsuccess, setSignupsuccess] = useState(false);
  const [signupfailed, setSignupfailed] = useState(false);
  const [signuperror, setSignuperror] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isValidPassword = (password: string): boolean => {
    const pattern = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return pattern.test(password);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordError(
        isValidPassword(value)
          ? ""
          : "Password must be at least 6 characters, include a letter and a number."
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isValidPassword(form.password)) {
      setPasswordError(
        "Password must be at least 6 characters, include a letter and a number."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(API.REGISTER, form, {
        withCredentials: true,
      });
      console.log("Signup successful:", response.data);
      setSignupsuccess(true);
    } catch (error: any) {
      console.error("Signup failed:", error);
      setSignuperror(error?.response?.data?.detail || "Something went wrong.");
      setSignupfailed(true);
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
            Create an Account
          </h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded mb-4"
            required
          />
          {passwordError && (
            <p className="text-red-500 text-sm mb-3">{passwordError}</p>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primarydark text-white cursor-pointer"
            }`}
            disabled={loading}
          >
            {loading ? "Signing Up" : "Sign Up"}
          </button>
          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">
              Already have an account?{" "}
            </span>
            <Link
              to="/signin"
              className="text-primary hover:underline font-medium"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
      <AlertModal
        isOpen={signupsuccess}
        title="Success"
        message="Signup successful!"
        onClose={() => navigate("/authredirect")}
        type="success"
      />
      <AlertModal
        isOpen={signupfailed}
        title="Failed"
        message={`Signup failed: ${signuperror}`}
        onClose={() => setSignupfailed(false)}
        type="error"
      />
    </div>
  );
}
