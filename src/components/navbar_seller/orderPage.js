// OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./orderStyle.css"


const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/orderssell-history', {
            headers: {
                Authorization:`Bearer ${localStorage.getItem('token')}`
              }
        });
      setOrders(response.data.orders);
      console.log("helloooo",response.data.orders);
      console.log('user id,',response.data.orders.user_id)
    } catch (error) {
      console.error('Error fetching order history:', error);
    }
  };

  return (
   
    <div className="order-history-container">
      <h2 className="order-history-title">Sales History</h2>
      {orders.map(order => (
        <div key={order.orderId} className="order-item">
          <div className="order-details">
            <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
            <div className="order-items">
              <table>
                <thead>
                  <tr>
                    <th>Signature No.</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productName}</td>
                      <td>{item.quantity}</td>
                      <td>{(item.quantity * item.productPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="total-price">
            <p>Total Amount    : {Number(order.totalPrice).toFixed(2)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistoryPage;