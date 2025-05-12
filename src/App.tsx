
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './components/pages/LandingPage'
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import AdminDashBoard from './components/pages/admin/AdminDashBoard';
import AuthRedirect from './components/pages/AuthRedirect';
import Home from './components/pages/Home';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import axios from 'axios';
import { useEffect } from 'react';
import API from './const/api_paths';
import BookRecommend from './components/pages/BookRecommend';
import Cart from './components/pages/Cart';
import Orders from './components/pages/Orders';
import { setUser, clearUser } from './store/authSlice';

function App() {
const dispatch = useDispatch<AppDispatch>();
 useEffect(() => {
    axios
      .get(API.AUTHENTICATE, { withCredentials: true })
      .then((res) => dispatch(setUser(res.data)))
      .catch(() => dispatch(clearUser()));
  }, [dispatch]);

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
