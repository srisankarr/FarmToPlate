// ResetPassword.js
import React, { useEffect, useState ,useRef} from 'react';
import { useAuthh } from '../../providersell/AuthProvidersell';
import {Navigate } from 'react-router-dom';
import './reset.css'

const ResetPassword = ({setIsLoginOpen}) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { resetPassword, message,resetRedirectToResetPassword ,clearMessage} = useAuthh();
  const loginRef = useRef(null);



  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsLoginOpen(false);
       clearMessage();

      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsLoginOpen,clearMessage]);








  useEffect(()=> {
    resetRedirectToResetPassword();
  },[ resetRedirectToResetPassword]);
 
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    await resetPassword(email, newPassword, confirmPassword);
  };

  if(message==='Password reset successfully'){
    return <Navigate to='../seller/logins' />
  }


  return (
    <div className="blur-background">
    <div  className="reset-password-container" ref={loginRef}>
      <h2>Reset Password</h2>
      <div className='reset-password-form'>
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <button onClick={handleResetPassword}>Reset Password</button>
      {message && <p>{message}</p>}
      </div>
    </div>
    </div>
  );
};

export default ResetPassword;