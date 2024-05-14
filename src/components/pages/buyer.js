// Buyer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../searchbar/searchBar'
import Navbar from '../navbar/navbar'; // Import Navbar component
import BannerSlider from '../Banners/BannerSlider';
import Homecategories from '../category/Homecatgory';
import ProductList from '../products/Productitem';

import { AuthProvider } from '../../provider/AuthProvider';
import Routing from '../../routes/Routes';
import Footer1 from '../Footer/Footer1';

const Buyer = ({ fetchCartCount}) => {
  const [selectedCategory, setSelectedCategory] = useState('Vegetables');
  
    const [searchQuery, setSearchQuery] = useState('');



  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  
  return (
    <div>

<div className="alogin-container">

<AuthProvider>

</AuthProvider>
             </div>
    <SearchBar  onSearch={handleSearch} />
             
    {!searchQuery &&   <div className="slider-container">
      <BannerSlider />
      </div>}

    {!searchQuery &&   <Homecategories onCategorySelected={handleCategorySelect}/>}
      <AuthProvider>
      <ProductList fetchCartCount={fetchCartCount} category={selectedCategory}  searchQuery={searchQuery}/>
      </AuthProvider>
    
     </div>
  );
};

export default Buyer;