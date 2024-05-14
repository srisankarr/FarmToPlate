// AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [message,setmessage]=useState('');
  const [isLoggedIn,setLoggedin]=useState(false);
  const [pro, setpro] = useState(null);
  const [redirectToResetPassword, setRedirectToResetPassword] = useState(false);
  useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setLoggedin(true);
      fetchProfile();
    }
  },[]);

  

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('triggeerd')
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );





  const login = async (credentials) => {
    try {
      // Make a POST request to your backend login endpoint with the provided credentials
      const response = await axios.post('http://localhost:5000/api/login', credentials);
      // Assuming the response contains user data upon successful login
      setUser(response.data.user);
      setmessage(response.data.message);
      setLoggedin(true);
       fetchProfile();
     
      localStorage.setItem('token', response.data.token);
   
    } catch (error) {
      console.error('Login error:', error.response.data.message);
      if (error.response.status === 401) {
        setmessage('Invalid email or password');
      } else {
        setmessage('Login failed. Please try again later.');
      }
    }
  };
const clearMessage=()=>{
  setmessage('');
};



  const signup = async (userData) => {
    try {
      // Make a POST request to your backend signup endpoint with the provided user data
      const response = await axios.post('http://localhost:5000/api/signup', userData);
      // Assuming the response contains user data upon successful signup
      setUser(response.data.user);
      setLoggedin(true);
      setmessage(response.data.message);
      console.log(response.data.message);
      localStorage.setItem('token', response.data.token);
      fetchProfile();
    } catch (error) {
      console.error('Signup error:', error);
      setmessage(null);
      // Handle signup error (e.g., display error message to the user)
    }
  };

  const logout = async () => {
    try {
      // Make a POST request to your backend logout endpoint to invalidate the user session
      await axios.post('http://localhost:5000/api/logout');
      // Clear the user state upon successful logout
      setUser(null);
      localStorage.removeItem('token');
      setLoggedin(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error (e.g., display error message to the user)
    }
  };


  const fetchProfile = async() =>{

    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: {
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      setpro( response.data);
    } 
      catch (error) {
        console.error('profile error:', error);
      }
  };


  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setmessage(response.data.message);
      setRedirectToResetPassword(true);
      console.log("in auth provider",redirectToResetPassword)
    } catch (error) {
      console.error('Forgot password error:', error);
      setmessage('Please Enter Correct Email');
    }
  };

  const resetRedirectToResetPassword=()=>{
    setRedirectToResetPassword(false);
  }

  const resetPassword = async (email, newPassword, confirmPassword) => {
    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        email,
        newPassword,
        confirmPassword,
      });
      setmessage(response.data.message);
    } catch (error) {
      console.error('Reset password error:', error);
      setmessage('Email Does Not Match');
    }
  };


  const addToCart = async (productId, quantity) => {
    try {
      console.log("authprovider")
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
     const response= await axios.post(`http://localhost:5000/api/cart/add/${productId}`, { quantity }, { headers: { Authorization:` Bearer ${token} `} });
      
    
      return response; 
      
      // Optionally, handle success or provide feedback to the user
    } catch (error) {
      console.error('Add to cart error:', error);
      // Optionally, handle error or provide feedback to the user
      
    }
  };













  return (
    <AuthContext.Provider value={{ user, login, signup, logout,message,isLoggedIn,forgotPassword,resetPassword,redirectToResetPassword,resetRedirectToResetPassword,clearMessage,addToCart,pro}}>
      {children}
    </AuthContext.Provider>
  );
};