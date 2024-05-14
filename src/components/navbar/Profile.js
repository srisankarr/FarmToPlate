// Profile.js
import React, { useState, useEffect,useRef } from 'react';
import { useAuth } from '../../provider/AuthProvider';
import './profile.css'
import { useNavigate } from 'react-router-dom';
import maleimg from '../../assets/images/male_avatar.png';
import femaleimg from '../../assets/images/female_avatar.png';

const Profile = ({setIsLoginOpen}) => {
  const { pro, logout} = useAuth();
  const [loading, setLoading] = useState(true);
  const loginRef = useRef(null);
  const navigate =useNavigate ();
  useEffect(() => {
    setLoading(false); // Set loading state to false when component mounts
  }, []);




  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setIsLoginOpen(false);
        navigate ('/buyer');
      }
    };
  
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [setIsLoginOpen]);


  return (
    <div className="blur-background">
    <div  className="profile-container" ref={loginRef}  >
      {loading ? (
        <p>Loading...</p>
      ) : pro ? (
        <div>
          <h2>Profile</h2>

          <img
              className="avatar"
              src={pro.gender === 'male' ? maleimg :pro.gender==='female'? femaleimg: null}
              alt="Avatar"
            />
          <p>Name: {pro.username}</p>
          <p>Email: {pro.email}</p>
          {/* Render other user details */}
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>No user profile found</p>
      )}
    </div>
    </div>
  );
};


export default Profile;