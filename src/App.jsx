import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import './App.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Buyerr from "./buyerrr";
import Sellerr from "./sellerr";
import LandingPage from "./landingPage";
import { AuthProviderr } from "./providersell/AuthProvidersell";
import AdminPage from "./components/adminPage/admin";


function App(){
  
 
    return (
        <Router>
        <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/buyer/*" element={<Buyerr />} />
            <Route path="/seller/*" element={<Sellerr />} />
            <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>

  
    );
}

export default App;