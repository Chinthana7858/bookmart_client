import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/pages/LandingPage";
import SignUp from "./components/pages/SignUp";
import SignIn from "./components/pages/SignIn";
import AdminDashBoard from "./components/pages/admin/AdminDashBoard";
import AuthRedirect from "./components/pages/AuthRedirect";
import Home from "./components/pages/Home";
import BookRecommend from "./components/pages/BookRecommend";
import Cart from "./components/pages/Cart";
import Orders from "./components/pages/Orders";
import AdminRoute from "./components/routes/AdminRoute";
import ProtectedRoute from "./components/routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/authredirect" element={<AuthRedirect />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashBoard />
              </AdminRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/book/:id" element={<BookRecommend />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
