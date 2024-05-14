import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './cartCard';
import './cartpage.css'
import { Link } from 'react-router-dom';
const CartPage = ({fetchCartCount}) => {
  const [cartItems, setCartItems] = useState([]);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phoneNumber: ''
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentOption, setPaymentOption] = useState('cashOnDelivery');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
 
    const fetchCartItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cart', {
            headers: {
                Authorization:`Bearer ${localStorage.getItem('token')}`
              }
        });
        const cartItemsWithDetails = await Promise.all(response.data.cartItems.map(async (item) => {
          // Fetch product details for each item in the cart
          const productResponse = await axios.get(`http://localhost:5000/api/products/${item.product_id}`);
          const product = productResponse.data;
          return {
            ...item,
            productName: product.name,
            productPrice: product.price,
            productImage: product.image
            
          };
        }));
        setCartItems(cartItemsWithDetails);
       calculateTotalPrice(cartItemsWithDetails);
      
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };


    useEffect(()=>{
    fetchCartItems();
  }, []);



  console.log("payment message",paymentMessage)
  const calculateTotalPrice =(items) => {

    let total = 0;
    items.forEach(item => {
      total += item.productPrice * item.quantity;
    });
    setTotalPrice(total);

   
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
        headers: {
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
      });
    await fetchCartItems();
    await fetchCartCount();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const handleDelivery = async () => {
    setShowAddressForm(true);
  };


  const handlePaymentOptionChange = (option) => {
    setPaymentOption(option);
    if (option !== 'cashOnDelivery') {
      setPaymentMessage('This payment method is currently unavailable.');
    } else {
      setPaymentMessage('');
    }
  };




  const handleSubmitOrder = async () => {
    if (!deliveryDetails.name || !deliveryDetails.street || !deliveryDetails.city || !deliveryDetails.state || !deliveryDetails.zipCode || !deliveryDetails.phoneNumber) {
      alert('Please fill in all delivery details');
      return;
        }
        if(paymentMessage==='This payment method is currently unavailable.')
        {
          alert('select valid payment')
          return;
        }
        

    try {
          const formattedItems=cartItems.map(item=>({
            productName:item.productName,
            productId : item.product_id,
            quantity :item.quantity,
            image:item.productImage,
            productPrice:item.productPrice
          }));

          const itemsjson =JSON.stringify(formattedItems);

          console.log("cart",cartItems)
        
      const response = await axios.post('http://localhost:5000/api/order', {
        items: itemsjson,
        deliveryDetails,
        paymentOption,
        totalPrice
      }, {
        headers: {
          Authorization:` Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log('Order placed successfully:', response.data);
      // Implement any additional logic after placing the order
      await fetchCartCount();
      setCartItems([]);
      alert('Order placed successfully!');
        setDeliveryDetails({
          name: '',
          street: '',
          city: '',
          state: '',
          zipCode: '',
          phoneNumber: ''
        });

    fetchCartItems();
      setShowAddressForm(false);

    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  







  return (
    <div className="container">
      <h2 className="header">Cart</h2>
      <div className='historyyy'>
      <Link to="../buyer/orders-history" className='saleshead'>Order History</Link>
      </div>
      <div className="cartt">
          <div className="product-cardss">
        {cartItems.map(item => (
          <ProductCard key={item.product_id} item={item} handleRemoveFromCart={handleRemoveFromCart} />
        ))}
             </div>

             <div className="summary">
               <h2>Total Price: {totalPrice}</h2>

     {cartItems.length>0 &&(<div>
      <h2>Delivery</h2>
      <button className="delivery-btn" onClick={handleDelivery}>Delivery</button>
      {showAddressForm && (
        <div className="delivery-form">
          <h2>Add Delivery Details</h2>
          <div>
            <label>Name:</label>
            <input type="text" value={deliveryDetails.name} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, name: e.target.value })} />
          </div>
          <div>
            <label>Street:</label>
            <input type="text" value={deliveryDetails.street} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, street: e.target.value })} />
          </div>
          <div>
            <label>City:</label>
            <input type="text" value={deliveryDetails.city} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })} />
          </div>
          <div>
            <label>State:</label>
            <input type="text" value={deliveryDetails.state} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, state: e.target.value })} />
          </div>
          <div>
            <label>Zip Code:</label>
            <input type="text" value={deliveryDetails.zipCode} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, zipCode: e.target.value })} />
          </div>
          <div>
            <label>Phone Number:</label>
            <input type="text" value={deliveryDetails.phoneNumber} onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phoneNumber: e.target.value })} />
          </div>
       
    
          <div className="payment-options">
          
      <h2>Payment</h2>
      <div className='payment-method'>
      <div>
        <input
          type="radio"
          id="cashOnDelivery"
          name="paymentOption"
          value="cashOnDelivery"
          checked={paymentOption === 'cashOnDelivery'}
          onChange={() => handlePaymentOptionChange('cashOnDelivery')}
        />
        <label htmlFor="cashOnDelivery">Cash on Delivery</label>
      </div>
      <div>
        <input
          type="radio"
          id="creditCard"
          name="paymentOption"
          value="creditCard"
          checked={paymentOption === 'creditCard'}
          onChange={() => handlePaymentOptionChange('creditCard')}
        />
        <label htmlFor="creditCard">Credit Card</label>
      </div>
     
      <div>
        <input
          type="radio"
          id="UPI"
          name="paymentOption"
          value="UPI"
          checked={paymentOption === 'UPI'}
          onChange={() => handlePaymentOptionChange('UPI')}
        />
        <label htmlFor="UPI">UPI</label>
      </div>


      </div>
      
      {paymentMessage && <p className="errorr-message">{paymentMessage}</p>}
      <button className="submit-order-btn" onClick={handleSubmitOrder}>Submit Order</button>
   
      
      
      </div>
      </div>
          )}
          </div>
          )}
      </div>
      </div>

    </div>
  );
};

export default CartPage;