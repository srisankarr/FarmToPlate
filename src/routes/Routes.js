import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from '../components/navbar/navbar';

import Login from '../components/navbar/Login';
import Signup from '../components/navbar/Signup';
import Profile from '../components/navbar/Profile';
import ForgotPassword from '../components/navbar/forgetpass';
import ResetPassword from '../components/navbar/resetpass';
import CartPage from '../components/navbar/addToCartPage';
import OrderHistoryPage from "../components/navbar/orderPage"
const Routing = ({CartCount,fetchCartCount}) => {
  
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Router>
      <Navbar setIsLoginOpen={setIsLoginOpen}  cartCount={CartCount} FetchCartCount={fetchCartCount}/>
      <Routes>
     
        <Route exact path="/login" element={isLoginOpen &&<Login setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/signup" element={isLoginOpen &&<Signup setIsLoginOpen={setIsLoginOpen}/>} />
        <Route exact path="/profile" element={isLoginOpen &&<Profile setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/forgot-password" element={isLoginOpen &&<ForgotPassword setIsLoginOpen={setIsLoginOpen}/>} />
        <Route exact path="/reset-password" element={isLoginOpen &&<ResetPassword setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/addtocart" element={<CartPage FetchCartCount={fetchCartCount}/>} />
        <Route exact path="/orders-history" element={<OrderHistoryPage />} />
      </Routes>
    </Router>
  );
}

export default Routing;