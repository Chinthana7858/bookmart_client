
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './components/pages/LandingPage'
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import AdminDashBoard from './components/pages/admin/AdminDashBoard';
import AuthRedirect from './components/pages/AuthRedirect';
import Home from './components/pages/Home';
import BookRecommend from './components/pages/BookRecommend';
import Cart from './components/pages/Cart';
import Orders from './components/pages/Orders';

function App() {
  return (
    <Router>
    <div>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin/dashboard" element={<AdminDashBoard/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/authredirect" element={<AuthRedirect/>} />
         <Route path="/book/:id" element={<BookRecommend/>} />
         <Route path="/cart" element={<Cart/>} />
         <Route path="/orders" element={<Orders/>} />
      </Routes>
    </div>
  </Router>
  )
}

export default App
