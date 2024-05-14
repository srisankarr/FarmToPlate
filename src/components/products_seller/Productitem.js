

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './procard';
import './productlist.css'

function ProductList({fetchCartCount,category, searchQuery}) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState('');


  useEffect(() => {
    // Fetch product data from the backend when the component mounts
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productssell');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts(); // Call the fetchProducts function
  }, []);


  useEffect(() => {
    const filterProducts = () => {
      if (!searchQuery) {
        setFilteredProducts(products.filter(product => product.category === category));
      } else {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
        if (filtered.length === 0) {
          setError('No products found for the given search query.');
        } else {
          setError('');
        }
      }
    };

    filterProducts();
  }, [category, products, searchQuery]);

 

  return (
    <div className="product-list">
        {error ? (
        <div className="error-message">{error}</div>
      ) : (
        filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} fetchCartCount={fetchCartCount} />
        ))
      )}
    <div><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
</div>
  </div>
  );
}

export default ProductList;