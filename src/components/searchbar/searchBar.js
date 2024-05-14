import React, { useState } from 'react';


import './search.css'
function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    const inputValue= event.target.value;
    setQuery(inputValue);
    onSearch(inputValue);
  };

  const handleSearch = () => {
    onSearch(query);
    // Implement your search logic here using the 'query' state
    console.log('Searching for:', query);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
      />
      <button className="search-button"  onClick={handleSearch}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="search-icon">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>
</button>
   
      
    </div>
  );
}

export default SearchBar;