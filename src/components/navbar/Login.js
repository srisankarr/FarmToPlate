// Login.js
import React, { useState,useRef, useEffect } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { useAuth } from '../../provider/AuthProvider';
import './login.css';
const Login = ({setIsLoginOpen}) => {
  const { login,message,clearMessage } = useAuth();
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const loginRef = useRef(null);
const navigate =useNavigate ();


  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsLoginOpen(false);
        
        clearMessage();
        navigate ('/buyer');
     
      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsLoginOpen,clearMessage]);


  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="blur-background">
    <div className="login-container" ref={loginRef}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input type="email" name="email" value={credentials.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={credentials.password} onChange={handleChange} placeholder="Password" required />
        <button type="submit">Login</button>
        {message&&<p>{message}</p>}
        <Link to="../buyer/forgot-password" onClick={() =>{setIsLoginOpen(true); clearMessage(); }}>Forgot Password</Link>

      </form>
    </div>
  </div>
  );
};

export default Login;