// Signup.js
import React, { useState ,useRef, useEffect} from 'react';
import { useAuthh } from '../../providersell/AuthProvidersell';
import "./signup.css"
import { useNavigate } from 'react-router-dom';
const Signup = ({setIsLoginOpen}) => {
  const { signup,message,clearMessage } = useAuthh();
  const [userData, setUserData] = useState({ username: '', email: '', password: '',gender: 'male' });
  const loginRef = useRef(null);
  const navigate =useNavigate ();
  
  
  
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsLoginOpen(false);
       
        clearMessage();
        navigate ('/seller');
      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsLoginOpen,clearMessage]);


  
  
  
  
  
  
  
  
  
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(userData);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="blur-background">
    <div className="signup-container"   ref={loginRef}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className='signup-form'>
        <input type="text" name="username" value={userData.username} onChange={handleChange} placeholder="Username" required />
        <input type="email" name="email" value={userData.email} onChange={handleChange} placeholder="Email" required />
        <input type="password" name="password" value={userData.password} onChange={handleChange} placeholder="Password" required />
        <div className="gender-container"> {/* Add this div for the gender radio buttons */}
            <label className="gender-label">
              <input type="radio" name="gender" value="male" checked={userData.gender === 'male'} onChange={handleChange} />
              <span>Male</span>
            </label>
            <label className="gender-label">
              <input type="radio" name="gender" value="female" checked={userData.gender === 'female'} onChange={handleChange} />
              <span>Female</span>
            </label>
          </div>
       
        <button type="submit">Sign Up</button>
        {message&&<p>{message}</p>}
      </form>
    </div>

    </div> 
  );
};

export default Signup;