import React, { useState } from "react";
import "./admin.css"; // Import your CSS file for styling
import axios from 'axios';
function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersSell, setUsersSell] = useState([]);
  const [ordersSell, setOrdersSell] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if password is correct (you can replace this with your authentication logic)
    if (password === "admin123") {
      setAuthenticated(true);
      // Fetch initial data
      await fetchAllData();
    } else {
      alert("Incorrect password");
    }
  };


  const fetchAllData = async () => {
    await Promise.all([
      fetchUsers(),
      fetchUsersSell(),
      fetchOrders(),
      fetchOrdersSell()
    ]);
  };




  // Function to fetch users from backend API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users-admin');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const fetchUsersSell = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/userssell-admin');
      setUsersSell(response.data);
    } catch (error) {
      console.error('Error fetching userssell:', error);
    }
  };



  // Function to fetch orders from backend API
    const fetchOrders = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/orders-admin');
          setOrders(response.data.orders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };

      console.log("order value",orders)

      const fetchOrdersSell = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/orderssell-admin');
          setOrdersSell(response.data.orders);
        } catch (error) {
          console.error('Error fetching orderssell:', error);
        }
      };

 
      const handleSectionClick = async (section) => {
        console.log("selection",section)
        setSelectedSection(section);
        switch (section) {
          case "Users":
            await fetchUsers();
            break;
          case "UsersSell":
            await fetchUsersSell();
            break;
          case "Orders":
            await fetchOrders();
            break;
          case "OrdersSell":
            await fetchOrdersSell();
            break;
          default:
            break;
        }
      };






  return (
    <div className="admin-page">
   
      {!authenticated ? (
        <form onSubmit={handleSubmit} className="form-container">
        <h2>Hello Admin</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit">Login</button>
        </form>
       
      ) : (
        
        <div>
        <div className="adminhead"> 
        <h1> WELCOME ADMIN</h1>
        
        </div>
          <div className="sidebar">
            <ul>
              <li onClick={() => handleSectionClick("Users")}>Users</li>
              <li onClick={() => handleSectionClick("UsersSell")}>Seller Users</li>
              <li onClick={() => handleSectionClick("Orders")}>Delivery Orders</li>
              <li onClick={() => handleSectionClick("OrdersSell")}>Pickup Orders</li>
            </ul>
          </div>
          <div className="content data-tables">
            { selectedSection ==="Users" &&(  
              <div>     
             <h2>Users</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>           
             </div>       
              )}
            
              { selectedSection ==="UsersSell" &&(  <div>   
              
                <h2>Seller Users</h2>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                {usersSell.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.password}</td>
                  </tr>
                ))}
              </tbody>
            </table>
              
              
              
              
                  </div>)} 

          

          
            { selectedSection ==="Orders" &&(  <div>    
            
            
            
              <h2>Seller Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Delivery Items</th>
                  <th>Total Price</th>
                  <th>Delivery Address</th>
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              <tbody>
              {orders.map((order) => (
             <tr key={order.orderId}>
               <td>{order.orderId}</td>
             <td>{order.userId}</td>
              <td>
              <ul>
                  {order.items.map((item, index) => (
                 <li key={index}>{item.productName} - {item.quantity}</li>
              ))}
           </ul>
            </td> 
            <td>{order.totalPrice}</td>
           <td>{JSON.stringify(order.deliveryDetails)}</td> {/* Parse JSONB field */}
            {/* Parse JSONB array */}
             {/* Add more rows as needed */}
             </tr>
            ))}
              </tbody>
            </table>
            
               </div>)} 
          
            
            { selectedSection ==="OrdersSell" &&(  <div> 
            
              <h2>Seller Orders</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Delivery Items</th>
                  <th>Total Price</th>
                  <th>Delivery Address</th>
                  {/* Add more columns as needed */}
                </tr>
              </thead>
              <tbody>
              {ordersSell.map((order) => (
             <tr key={order.orderId}>
               <td>{order.orderId}</td>
             <td>{order.userId}</td>
              <td>
              <ul>
                  {order.items.map((item, index) => (
                 <li key={index}>{item.productName} - {item.quantity}</li>
              ))}
           </ul>
            </td> 
            <td>{order.totalPrice}</td>
           <td>{JSON.stringify(order.deliveryDetails)}</td> {/* Parse JSONB field */}
            {/* Parse JSONB array */}
             {/* Add more rows as needed */}
             </tr>
            ))}
              </tbody>
            </table>
            
                  </div>)} 

            
           
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
