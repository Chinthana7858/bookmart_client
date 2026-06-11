import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoCartSharp } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
import { FiGrid, FiUser } from "react-icons/fi";
import ConfirmModal from "../UI/molecules/modals/ConfirmModal";
import { useAuth } from "../../auth";
import logo from "../../assets/logo.png";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Books", to: "/home" },
  { label: "About", to: "/#about" },
  { label: "Contact", to: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showlogoutmodal, setShowlogoutmodal] = useState(false);

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = user?.role === "admin";

  const handleLogout = async () => {
    try {
      await logout();
      setShowlogoutmodal(false);
      navigate("/");
    } catch {
      alert("Logout failed.");
    }
  };

  const linkClass = (isActive: boolean) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? "bg-secondary text-primarydark"
        : "text-stone-600 hover:bg-stone-100 hover:text-stone-950"
    }`;

  const isNavItemActive = (to: string) => {
    const [pathname, hash = ""] = to.split("#");
    const targetPath = pathname || "/";
    const targetHash = hash ? `#${hash}` : "";

    if (targetHash) {
      return location.pathname === targetPath && location.hash === targetHash;
    }

    return location.pathname === targetPath && !location.hash;
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="page-container">
        <div className="flex min-h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="BookMart"
              className="h-10 w-10 rounded-md object-contain"
            />
            <div>
              <div className="text-base font-bold tracking-normal text-stone-950">
                BookMart
              </div>
              {user && (
                <div className="hidden text-xs text-stone-500 sm:block">
                  Welcome, {user.name}
                </div>
              )}
            </div>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={linkClass(isNavItemActive(item.to))}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {loading ? (
              <div className="h-10 w-32 animate-pulse rounded-md bg-stone-100" />
            ) : user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin/dashboard"
                    className="btn-secondary h-10 px-3"
                    aria-label="Admin dashboard"
                  >
                    <FiGrid size={18} />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/cart"
                      className="btn-secondary h-10 px-3"
                      aria-label="Cart"
                    >
                      <IoCartSharp size={20} />
                      Cart
                    </Link>
                    <Link
                      to="/orders"
                      className="btn-secondary h-10 px-3"
                      aria-label="Orders"
                    >
                      <GrDeliver size={18} />
                      Orders
                    </Link>
                    <Link
                      to="/profile"
                      className="btn-secondary h-10 px-3"
                      aria-label="Profile"
                    >
                      <FiUser size={18} />
                      Profile
                    </Link>
                  </>
                )}
                <button
                  className="btn-primary h-10"
                  onClick={() => setShowlogoutmodal(true)}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn-secondary h-10">
                  Sign in
                </Link>
                <Link to="/signup" className="btn-primary h-10">
                  Join us
                </Link>
              </>
            )}
          </div>

          <button
            className="grid h-10 w-10 place-items-center rounded-md border border-stone-200 text-stone-700 md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open menu"
          >
            {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-stone-200 py-4 md:hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={linkClass(isNavItemActive(item.to))}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mt-4 grid gap-2">
              {user ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="btn-secondary justify-start"
                      onClick={() => setIsOpen(false)}
                    >
                      <FiGrid size={18} />
                      Dashboard
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/cart"
                        className="btn-secondary justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <IoCartSharp size={20} />
                        Cart
                      </Link>
                      <Link
                        to="/orders"
                        className="btn-secondary justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <GrDeliver size={18} />
                        Orders
                      </Link>
                      <Link
                        to="/profile"
                        className="btn-secondary justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <FiUser size={18} />
                        Profile
                      </Link>
                    </>
                  )}
                  <button
                    className="btn-primary justify-start"
                    onClick={() => setShowlogoutmodal(true)}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/signin" className="btn-secondary">
                    Sign in
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Join us
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showlogoutmodal}
        title="Do you want to logout?"
        message=""
        onConfirm={handleLogout}
        onCancel={() => setShowlogoutmodal(false)}
      />
    </nav>
  );
}
