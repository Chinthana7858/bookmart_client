import { useState } from "react";
import { HiMenu } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { IoCartSharp } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
import ConfirmModal from "../UI/molecules/modals/ConfirmModal";
import { useAuth } from "../../AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showlogoutmodal, setShowlogoutmodal] = useState(false);

  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setShowlogoutmodal(false);
      navigate("/");
    } catch (err) {
      alert("Logout failed.");
    }
  };
  if (loading)
    return (
      <nav className="bg-white shadow-sm px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className=" flex-col">
              <Link to={"/"} className=" cursor-pointer">
                <div className="w-6 h-6 bg-primary rounded-sm" />
                <h1 className="text-lg font-bold text-gray-800">Book Mart</h1>
              </Link>
            </div>
          </div>

          <ul className="hidden md:flex gap-6 text-sm text-gray-700">
            <Link to={"/"}>
              <li className="cursor-pointer hover:text-primary">Home</li>
            </Link>

            <Link to={"/home"}>
              <li className="cursor-pointer hover:text-primary">Books</li>
            </Link>

            <Link to="/#about">
              <li className="cursor-pointer hover:text-primary">About us</li>
            </Link>
            <Link to="/#contact">
              <li className="cursor-pointer hover:text-primary">Contact us</li>
            </Link>
          </ul>
           <div>
              <Link to={"/signin"}>
                <button className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer mx-2">
                  Sign in
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer mx-2">
                  Join us
                </button>
              </Link>
            </div>

          <div className="md:hidden cursor-pointer">
            <button onClick={() => setIsOpen(!isOpen)}>
              <HiMenu size={24} />
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-4 text-gray-700">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <a href="/#about" className="hover:text-primary">
              About us
            </a>
            <a href="/#books" className="hover:text-primary">
              Books
            </a>
            <a href="/#contact" className="hover:text-primary">
              Contact us
            </a>
            
          </div>
        )}
        
      </nav>
    );
  return (
    <nav className="bg-white shadow-sm px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className=" flex-col">
            <Link to={"/"} className=" cursor-pointer">
              <div className="w-6 h-6 bg-primary rounded-sm" />
              <h1 className="text-lg font-bold text-gray-800">Book Mart</h1>
            </Link>
            {user && (
              <div className=" text-xs font-medium  text-gray-500">
                Welcome, {user.name}
              </div>
            )}
          </div>
        </div>

        <ul className="hidden md:flex gap-6 text-sm text-gray-700">
          <Link to={"/"}>
            <li className="cursor-pointer hover:text-primary">Home</li>
          </Link>

          <Link to={"/home"}>
            <li className="cursor-pointer hover:text-primary">Books</li>
          </Link>

          <Link to="/#about">
            <li className="cursor-pointer hover:text-primary">About us</li>
          </Link>
          <Link to="/#contact">
            <li className="cursor-pointer hover:text-primary">Contact us</li>
          </Link>
        </ul>

        <div className="hidden md:flex gap-2">
          {user ? (
            <div className="flex items-center gap-6 bg-white px-6 py-3   border-gray-200">
              {/* Cart */}
              <Link
                to="/cart"
                className="flex items-center gap-2 text-primary font-semibold hover:text-primarydark transition duration-200"
              >
                <IoCartSharp size={24} />
                <span>Cart</span>
              </Link>

              <Link
                to="/orders"
                className="flex items-center gap-2 text-primary font-semibold hover:text-primarydark transition duration-200"
              >
                <GrDeliver size={20} />
                <span>Orders</span>
              </Link>

              <button
                className="ml-4 bg-primary hover:bg-primarydark text-white font-medium px-5 py-2 rounded-full transition duration-300 cursor-pointer"
                onClick={() => {
                  setShowlogoutmodal(true);
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <Link to={"/signin"}>
                <button className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer mx-2">
                  Sign in
                </button>
              </Link>
              <Link to={"/signup"}>
                <button className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer mx-2">
                  Join us
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden cursor-pointer">
          <button onClick={() => setIsOpen(!isOpen)}>
            <HiMenu size={24} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-4 flex flex-col gap-4 text-gray-700">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <a href="/#about" className="hover:text-primary">
            About us
          </a>
          <a href="/#books" className="hover:text-primary">
            Books
          </a>
          <a href="/#contact" className="hover:text-primary">
            Contact us
          </a>

          <div className="flex gap-2">
            {user ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex flex-col items-left gap-4 text-primary font-semibold">
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 hover:text-primarydark "
                  >
                    <GrDeliver size={20} />
                    <span className="text-sm">Orders</span>
                  </Link>

                  <Link
                    to="/cart"
                    className="flex items-center gap-2 hover:text-primarydark "
                  >
                    <IoCartSharp size={22} />
                    <span className="text-sm">Cart</span>
                  </Link>
                </div>

                <button
                  onClick={() => {
                    setShowlogoutmodal(true);
                  }}
                  className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer mr-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div>
                <Link to={"/signin"}>
                  <button className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer mr-2">
                    Sign in
                  </button>
                </Link>
                <Link to={"/signup"}>
                  <button className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer">
                    Join us
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
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
