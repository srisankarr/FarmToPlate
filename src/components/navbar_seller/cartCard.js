import React from 'react';
import './cartcard.css'

const ProductCard = ({ item, handleRemoveFromCart }) => {

  const imagePath=process.env.PUBLIC_URL+ '/images/'+item.productImage;


  return (
    <div className="product-card">
      <img src={imagePath} alt={item.productName} />
      <div className="product-details">
        <h3>{item.productName}</h3>
        <p>Quantity: {item.quantity}</p>
        <p>Amount: ₹{item.productPrice * item.quantity}</p>
        <button onClick={() => handleRemoveFromCart(item.product_id)}>Remove</button>
      </div>
    </div>
  );
};

export default ProductCard;