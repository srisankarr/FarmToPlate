// Buyer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../searchbar/searchBar'
import Navbar from '../navbar/navbar'; // Import Navbar component
import Homecategories from '../categorysell/Homecatgory';
import ProductList from '../products_seller/Productitem';
import { AuthProviderr } from '../../providersell/AuthProvidersell';
import Routing from '../../routes/Routes';
import Footer1 from '../Footer/Footer1';
import BannerSlider from '../Bannerssell/BannerSlider';
const Sell = ({ fetchCartCount}) => {

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

<AuthProviderr>

</AuthProviderr>
             </div>
    <SearchBar  onSearch={handleSearch} />
             
    {!searchQuery &&   <div className="slider-container">
 <BannerSlider />
      </div>}

    {!searchQuery &&   <Homecategories onCategorySelected={handleCategorySelect}/>}
      <AuthProviderr>
      <ProductList fetchCartCount={fetchCartCount} category={selectedCategory}  searchQuery={searchQuery}/>
      </AuthProviderr>
    
     </div>
  );
};

export default Sell;