import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryManagement from "../../UI/organisms/admin/CategoryManagement";
import BookManagement from "../../UI/organisms/admin/BookManagement";
import OrderManagement from "../../UI/organisms/admin/OrderManagement";
import UserManagement from "../../UI/organisms/admin/UserManagement";
import ConfirmModal from "../../UI/molecules/modals/ConfirmModal";
import { useAuth } from "../../../AuthContext";

export default function AdminDashBoard() {
  const [showlogoutmodal, setShowlogoutmodal] = useState(false);

  const [activeTab, setActiveTab] = useState("books");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      alert("Logout failed.");
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "books":
        return (
          <div>
            <BookManagement />
          </div>
        );
      case "categories":
        return <CategoryManagement />;
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      default:
        return <div></div>;
    }
  };

  const tabs = [
    { id: "books", label: "Books" },
    { id: "categories", label: "Categories" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {" "}
          <div className="w-6 h-6 bg-primary rounded-sm" />
          Admin Dashboard
        </h1>
        <button
          onClick={() => {
            setShowlogoutmodal(true);
          }}
          className="bg-primary text-white px-4 py-1 rounded hover:bg-primarydark cursor-pointer mr-2"
        >
          Logout
        </button>
      </header>

      <nav className="bg-white shadow-sm px-8 py-3">
        <ul className="flex gap-6 text-gray-700 font-medium">
          {tabs.map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer pb-2 ${
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary"
                  : "hover:text-primarydark"
              }`}
            >
              {tab.label}
            </li>
          ))}
        </ul>
      </nav>

      <main className="p-8">{renderTabContent()}</main>
      <ConfirmModal
        isOpen={showlogoutmodal}
        title="Do you want to logout?"
        message=""
        onConfirm={handleLogout}
        onCancel={() => setShowlogoutmodal(false)}
      />
    </div>
  );
}
