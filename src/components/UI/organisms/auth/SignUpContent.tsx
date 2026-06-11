import { useState } from "react";
import Navbar from "../../../templates/Navbar";
import type { SignUpFormData } from "../../../../types/user";
import AlertModal from "../../molecules/modals/AlertModal";
import ConfirmModal from "../../molecules/modals/ConfirmModal";
import { DropdownSelect } from "../../atoms/FormControls";
import { Link, useNavigate } from "react-router-dom";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { useAuth } from "../../../../auth";
import {
  getApiErrorMessage,
  useLazyAuthenticateQuery,
  useRegisterMutation,
} from "../../../../services/bookmartApi";
import { countryCodeOptions, countryOptions } from "../../../../const/countries";

const genderOptions = [
  { label: "Select gender", value: "" },
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Non-binary", value: "non_binary" },
  { label: "Prefer not to say", value: "prefer_not_to_say" },
  { label: "Other", value: "other" },
];

const addressLabelOptions = [
  { label: "Home", value: "Home" },
  { label: "Office", value: "Office" },
  { label: "Billing", value: "Billing" },
  { label: "Other", value: "Other" },
];

export default function Signup() {
  const { setUser } = useAuth();
  const [form, setForm] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    phone_country_code: "+94",
    phone_number: "",
    birthday: "",
    gender: "",
    primary_address: {
      label: "Home",
      recipient_name: "",
      phone_country_code: "+94",
      phone_number: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Sri Lanka",
      is_default: true,
    },
  });
  const [passwordError, setPasswordError] = useState("");
  const [signupsuccess, setSignupsuccess] = useState(false);
  const [signupfailed, setSignupfailed] = useState(false);
  const [signuperror, setSignuperror] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [register] = useRegisterMutation();
  const [authenticate] = useLazyAuthenticateQuery();
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
          : "Use at least 6 characters with a letter and a number."
      );
    }
  };

  const handleAddressChange = (name: string, value: string) => {
    setForm({
      ...form,
      primary_address: {
        ...form.primary_address!,
        [name]: value,
      },
    });
  };

  const requestSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidPassword(form.password)) {
      setPasswordError("Use at least 6 characters with a letter and a number.");
      return;
    }

    setShowSignupConfirm(true);
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const payload: SignUpFormData = {
        ...form,
        birthday: form.birthday || undefined,
        gender: form.gender || undefined,
        primary_address: form.primary_address
          ? {
              ...form.primary_address,
              recipient_name: form.primary_address.recipient_name || form.name,
              phone_country_code:
                form.primary_address.phone_country_code || form.phone_country_code,
              phone_number: form.primary_address.phone_number || form.phone_number,
            }
          : undefined,
      };
      await register(payload).unwrap();
      const user = await authenticate().unwrap();
      setUser(user);
      setShowSignupConfirm(false);
      setSignupsuccess(true);
    } catch (error) {
      setSignuperror(getApiErrorMessage(error));
      setSignupfailed(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      <main className="page-container grid min-h-[calc(100vh-4rem)] place-items-center py-10">
        <form onSubmit={requestSubmit} className="surface w-full max-w-lg p-6 md:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              Create account
            </p>
            <h1 className="mt-2 text-2xl font-bold text-stone-950">Join BookMart</h1>
            <p className="mt-2 text-sm text-stone-500">
              Save your cart and keep track of your orders.
            </p>
          </div>

          <div className="grid gap-4">
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              className="field w-full"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="field w-full"
              required
            />

            <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
              <DropdownSelect
                label="Country code"
                value={form.phone_country_code || "+94"}
                onChange={(value) =>
                  setForm({
                    ...form,
                    phone_country_code: value,
                    primary_address: {
                      ...form.primary_address!,
                      phone_country_code: value,
                    },
                  })
                }
                options={countryCodeOptions}
              />
              <input
                type="tel"
                name="phone_number"
                placeholder="Phone number"
                value={form.phone_number || ""}
                onChange={(event) =>
                  setForm({
                    ...form,
                    phone_number: event.target.value,
                    primary_address: {
                      ...form.primary_address!,
                      phone_number: event.target.value,
                    },
                  })
                }
                className="field w-full"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="date"
                name="birthday"
                value={form.birthday || ""}
                onChange={handleChange}
                className="field w-full"
                aria-label="Birthday"
              />
              <DropdownSelect
                label="Gender"
                value={form.gender || ""}
                onChange={(value) => setForm({ ...form, gender: value as SignUpFormData["gender"] })}
                options={genderOptions}
              />
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-4">
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-stone-950">Primary address</h2>
                <p className="text-xs text-stone-500">You can add office and other addresses later in profile management.</p>
              </div>
              <div className="grid gap-3">
                <DropdownSelect
                  label="Address type"
                  value={form.primary_address?.label || "Home"}
                  onChange={(value) => handleAddressChange("label", value)}
                  options={addressLabelOptions}
                />
                <input
                  type="text"
                  placeholder="Address line 1"
                  value={form.primary_address?.line1 || ""}
                  onChange={(event) => handleAddressChange("line1", event.target.value)}
                  className="field w-full"
                  required
                />
                <input
                  type="text"
                  placeholder="Address line 2"
                  value={form.primary_address?.line2 || ""}
                  onChange={(event) => handleAddressChange("line2", event.target.value)}
                  className="field w-full"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={form.primary_address?.city || ""}
                    onChange={(event) => handleAddressChange("city", event.target.value)}
                    className="field w-full"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State / province"
                    value={form.primary_address?.state || ""}
                    onChange={(event) => handleAddressChange("state", event.target.value)}
                    className="field w-full"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Postal code"
                    value={form.primary_address?.postal_code || ""}
                    onChange={(event) => handleAddressChange("postal_code", event.target.value)}
                    className="field w-full"
                  />
                  <DropdownSelect
                    label="Country"
                    value={form.primary_address?.country || "Sri Lanka"}
                    onChange={(value) => handleAddressChange("country", value)}
                    options={countryOptions}
                  />
                </div>
              </div>
            </div>

            <div>
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
              {passwordError && (
                <p className="mt-2 text-sm text-red-600">{passwordError}</p>
              )}
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="mt-5 text-center text-sm text-stone-600">
            Already have an account?{" "}
            <Link to="/signin" className="font-semibold text-primary hover:text-primarydark">
              Sign in
            </Link>
          </div>
        </form>
      </main>
      <AlertModal
        isOpen={signupsuccess}
        title="Success"
        message="Signup successful!"
        onClose={() => navigate("/authredirect")}
        type="success"
      />
      <ConfirmModal
        isOpen={showSignupConfirm}
        title="Create account?"
        message={`Create a BookMart account for ${form.email}?`}
        confirmText="Create"
        onConfirm={handleSubmit}
        onCancel={() => setShowSignupConfirm(false)}
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
