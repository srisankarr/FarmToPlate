import React, { useEffect, useState} from 'react';
import './productcard.css'; 
import { useAuthh } from '../../providersell/AuthProvidersell';

const ProductCard = ({ product ,fetchCartCount }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
 const { addToCart ,isLoggedIn }= useAuthh();

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = event.target.value;
    setQuantity(newQuantity);
  };


  if(isLoggedIn){
    fetchCartCount();
  }

  const handleAddToCart =async () => {
    // Call the addToCart function with the product id and quantity
   
   await addToCart(product.id,quantity);
    console.log(product.id,quantity);
    
    console.log("fetchhhhhhhhhh");
    console.log(fetchCartCount);
    await fetchCartCount();
  };




  const imagePath=process.env.PUBLIC_URL+ '/images/'+product.image;
  return (
    <div className="product-cardd">
      <div className="product-image">
        <img src={imagePath} alt={product.name} />
      
       
      </div>
      <div className="product-details">
        <div className="product-name">{product.name}</div>
        <div className='price-qty'>
        <div className="product-price-quantity">
        <div className="product-price">Price:</div>
        <div className='amount'>₹ {product.price}</div>
        </div>
        <div className="product-quantity">
        <label htmlFor={`quantity-${product.id}` } className="quantity-label" >Quantity (kg): </label>
              <div className="quantity-input">
            <button onClick={() => setQuantity(Math.max(0.5, quantity - 0.5))} className="quantity-btn">-</button>
        <input
             type="number"
            id={`quantity-${product.id}`}
          value={quantity}
           min="0.5"
            max="12"
          onChange={handleQuantityChange}
          className="quantity-input-field"
  />
  <button onClick={() => setQuantity(Math.min(100, quantity + 0.5))}className="quantity-btn"  >+</button>

        </div>
      </div>
      </div>
      </div>
      <div className={`favorite-icon ${isFavorite ? 'favorited' : ''}`} onClick={handleFavoriteClick}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
<path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
</svg>
      </div>
      <button className="add-to-cart-btn"   onClick={handleAddToCart} >Add to Sale</button>
    </div>
  );
};

export default ProductCard;