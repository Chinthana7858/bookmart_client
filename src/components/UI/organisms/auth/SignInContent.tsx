import Navbar from "../../../templates/Navbar";
import { useState } from "react";
import type { SignInFormData } from "../../../../types/user";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AlertModal from "../../molecules/modals/AlertModal";
import { useAuth } from "../../../../auth";
import { IoEyeOff, IoEye } from "react-icons/io5";
import LoadingSpinner from "../../atoms/LoadingSpinner";
import {
  getApiErrorMessage,
  useLazyAuthenticateQuery,
  useLoginMutation,
} from "../../../../services/bookmartApi";

type RedirectState = {
  from?: {
    pathname?: string;
    search?: string;
    hash?: string;
  };
};

export default function SignIn() {
  const { user, setUser, loading: authLoading } = useAuth();
  const [form, setForm] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const [signinfailed, setSigninfailed] = useState(false);
  const [signinerror, setSigninerror] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const [authenticate] = useLazyAuthenticateQuery();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectState = location.state as RedirectState | null;

  const getPostAuthRedirect = (role: "user" | "admin") => {
    const from = redirectState?.from;
    const fromPath = from?.pathname;

    if (!fromPath) {
      return role === "admin" ? "/admin/dashboard" : "/home";
    }

    if (role === "admin") {
      return fromPath.startsWith("/admin")
        ? `${fromPath}${from.search ?? ""}${from.hash ?? ""}`
        : "/admin/dashboard";
    }

    return fromPath.startsWith("/admin")
      ? "/home"
      : `${fromPath}${from.search ?? ""}${from.hash ?? ""}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={getPostAuthRedirect(user.role)} replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form).unwrap();
      const user = await authenticate().unwrap();
      setUser(user);
      navigate(getPostAuthRedirect(user.role), { replace: true });
    } catch (error) {
      setSigninerror(getApiErrorMessage(error));
      setSigninfailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main className="page-container grid min-h-[calc(100vh-4rem)] place-items-center py-10">
        <form onSubmit={handleSubmit} className="surface w-full max-w-md p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Welcome back
            </p>
            <h1 className="mt-2 text-2xl font-bold text-stone-950">Sign in</h1>
            <p className="mt-2 text-sm text-stone-500">
              Access your cart, orders, and recommendations.
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="field w-full"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="field w-full pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-stone-500"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {!showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
              </button>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="mt-5 text-center text-sm text-stone-600">
            New to BookMart?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:text-primarydark">
              Create an account
            </Link>
          </div>
        </form>
      </main>
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
