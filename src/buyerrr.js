import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/navbar/navbar";
import Buyer from "./components/pages/buyer";
import Login from "./components/navbar/Login";
import Signup from "./components/navbar/Signup";
import Profile from "./components/navbar/Profile";
import ForgotPassword from "./components/navbar/forgetpass";
import ResetPassword from "./components/navbar/resetpass";
import CartPage from "./components/navbar/addToCartPage";
import OrderHistoryPage from "./components/navbar/orderPage";
import { AuthProvider } from "./provider/AuthProvider";
import Footer1 from "./components/Footer/Footer1";
import About from "./components/aboutPage/About";
import Footer2 from "./components/Footer/Footer2";
import Contact from "./components/aboutPage/contactPage";



function Buyerr(){

    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [cartCount,setCartCount]=useState(0);
    const fetchCartCount =async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('No token found');
          }
          const response = await axios.get('http://localhost:5000/api/cart/count', {
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
        <AuthProvider>
        <Navbar setIsLoginOpen={setIsLoginOpen}  cartCount={cartCount} fetchCartCount={fetchCartCount}/>
        <Routes>
    
        <Route path="/" element={<Buyer  fetchCartCount={fetchCartCount}/>} />
      
        <Route exact path="/buyer/login" element={isLoginOpen &&<Login setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/buyer/signup" element={isLoginOpen &&<Signup setIsLoginOpen={setIsLoginOpen}/>} />
        
        <Route exact path="/buyer/profile" element={isLoginOpen &&<Profile setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/buyer/forgot-password" element={isLoginOpen &&<ForgotPassword setIsLoginOpen={setIsLoginOpen}/>} />
        <Route exact path="/buyer/reset-password" element={isLoginOpen &&<ResetPassword setIsLoginOpen={setIsLoginOpen} />} />
        <Route exact path="/buyer/addtocart" element={<CartPage fetchCartCount={fetchCartCount}/>} />
        <Route exact path="/buyer/orders-history" element={<OrderHistoryPage />} />
        <Route path="/buyer/aboutPage" element={<About />} />
        <Route path="/buyer/contact" element={<Contact />} />
   
      </Routes>
   
    <Footer1 />
    <Footer2 />
    </AuthProvider>
    
    );
}

export default Buyerr;