// ForgotPassword.js
import React, { useState,useRef, useEffect  } from 'react';
import { useAuth } from '../../provider/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './forget.css'
const ForgotPassword = ({setIsLoginOpen}) => {
  const [email, setEmail] = useState('');
  const { forgotPassword, message,redirectToResetPassword ,clearMessage} = useAuth();
  const loginRef = useRef(null);
  const navigate=useNavigate();
 




  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsLoginOpen(false);
       

      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsLoginOpen]);




  const handleForgotPassword = async () => {
    await forgotPassword(email);

  };

  if(redirectToResetPassword){

    setIsLoginOpen(true);
    navigate('../buyer/reset-password')
    clearMessage();
  }
  return (
    <div className="blur-background">
    <div className="forgot-password-container" ref={loginRef}>
      <h2>Forgot Password</h2>
      <div className='forgot-password-form'>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleForgotPassword}>Reset Password</button>
     {message && <p>{message}</p>}
     </div>
    </div>

    </div>
  );
};

export default ForgotPassword;