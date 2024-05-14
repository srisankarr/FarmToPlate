import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/navbar_seller/navbar";
import Buyer from "./components/pages/buyer";
import Login from "./components/navbar_seller/Login";
import Signup from "./components/navbar_seller/Signup";
import Profile from "./components/navbar_seller/Profile";
import ForgotPassword from "./components/navbar_seller/forgetpass";
import ResetPassword from "./components/navbar_seller/resetpass";
import CartPage from "./components/navbar_seller/addToCartPage";
import OrderHistoryPage from "./components/navbar_seller/orderPage";
import { AuthProviderr } from "./providersell/AuthProvidersell";
import Footer1 from "./components/Footer/Footer1sell";
import Sell from "./components/pagessell/seller";
import Footer from "./components/Footer/Footer2";
import Footer2 from "./components/Footer/Footer2sell";
import About from "./components/aboutPage/About";
import Contact from "./components/aboutPage/contactPage";


function Sellerr(){

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [cartCount,setCartCount]=useState(0);
    const fetchCartCount =async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
          const response = await axios.get('http://localhost:5000/api/cart-sell/count', {
            headers: { Authorization:` Bearer ${token}` }
          });
          if (response.data.success) {
            
           setCartCount(response.data.cartCount);
           console.log("countttt",response.data.cartCount);
          }
        } catch (error) {
          console.error('Error fetching cart count:', error);
        }
      }
      console.log("count1111tt",cartCount);

      useEffect(()=>{
        fetchCartCount();
      }, []);
    
 
    return (
        <AuthProviderr>
      
        <Navbar setIsLoginOpen={setIsLoginOpen}  cartCount={cartCount} fetchCartCount={fetchCartCount}/>
        <Routes>
    
        <Route path="/" element={<Sell fetchCartCount={fetchCartCount}/>} />
      
        <Route exact path="/seller/logins" element={isLoginOpen &&<Login setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/seller/signup" element={isLoginOpen &&<Signup setIsLoginOpen={setIsLoginOpen}/>} />
        
        <Route exact path="/seller/profile" element={isLoginOpen &&<Profile setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/seller/forgot-password" element={isLoginOpen &&<ForgotPassword setIsLoginOpen={setIsLoginOpen}/>} />
        <Route exact path="/seller/reset-password" element={isLoginOpen &&<ResetPassword setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/seller/addtocart" element={<CartPage fetchCartCount={fetchCartCount}/>} />
        <Route exact path="/seller/orders-history" element={<OrderHistoryPage />} />
        <Route path="/seller/aboutPage" element={<About />} />
        <Route path="/seller/contact" element={<Contact />} />
   
   
      </Routes>

    <Footer1 />
  
    <Footer2 />
    </AuthProviderr>
    
    );
}

export default Sellerr;