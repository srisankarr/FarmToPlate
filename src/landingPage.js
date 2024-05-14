// LandingPage.jsx
import React from 'react';
import "./landing.css"
import { useNavigate } from 'react-router-dom';
import buyer from "./assets/images/buyer.jpg";
import selller from "./assets/images/seller.jpg";

const LandingPage = () => {
    const navigate =useNavigate ();

  const handleSellerClick = () => {
    // Redirect to the seller page
    navigate ('/seller');
  };

  const handleBuyerClick = () => {
    // Redirect to the buyer page
    navigate ('/buyer');
  };

  return (
    <div className="landingpage">
      <h1>Welcome to Farm-To-Plate</h1>
      <div className="options">
        <div className="option" onClick={handleSellerClick}>
          <img src={selller} alt="Seller" />
          <p>Seller Area</p>
        </div>
        <div className="option" onClick={handleBuyerClick}>
          <img src={buyer} alt="Buyer" />
          <p>Buyer Area</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;