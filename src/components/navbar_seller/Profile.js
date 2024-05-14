// Profile.js
import React, { useState, useEffect,useRef } from 'react';
import { useAuthh } from '../../providersell/AuthProvidersell';
import './profile.css'
import { useNavigate } from 'react-router-dom';
import maleimg from '../../assets/images/male_avatar.png';
import femaleimg from '../../assets/images/female_avatar.png';

const Profile = ({setIsLoginOpen}) => {
  const { profi, logout} = useAuthh();
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
        navigate ('/seller');
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
      ) : profi ? (
        <div>
          <h2>Profile</h2>

          <img
              className="avatar"
              src={profi.gender === 'male' ? maleimg :profi.gender==='female'? femaleimg: null}
              alt="Avatar"
            />
          <p>Name: {profi.username}</p>
          <p>Email: {profi.email}</p>
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