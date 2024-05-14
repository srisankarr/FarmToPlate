const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import cors middleware
const { Pool } = require('pg');
const crypto=require('crypto');

const app = express();
const port = 5000;

// Use cors middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'sankar3012',
  port: 5432, // Default PostgreSQL port
});

const secretKey = crypto.randomBytes(32).toString('hex');

const generateToken = (userId) => {

  const payload = { userId };
  const options = { expiresIn: '1h' };
  return jwt.sign(payload, secretKey, options);
};



const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded Token:", decoded); // Log the decoded token
    return decoded;
  } catch (error) {
    console.error("Token Verification Error:", error);
    throw new Error("Invalid or expired token");
  }
};





app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});


// Login endpoint
app.post('/api/login', async (req, res) => {
  const {email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      const userId = result.rows[0].id;
      const token = generateToken(userId);
      res.cookie('jwtToken', token, { httpOnly: true });

      res.json({ success: true, message: 'Login successful', token });
    } else {
      res.status(401).json({ success: false, message: 'Enter Valid Email And Password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'internal sever error' });
  }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const {username,email, password,gender } = req.body;
  try {
    console.log(username);
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length > 0) {
      res.status(400).json({ success: false, message: 'Email already exists' });
    } else {
      await pool.query('INSERT INTO users (username,email, password,gender) VALUES ($1, $2,$3,$4)', [username,email, password,gender]);
      const insertedUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
     
      const userId = insertedUser.rows[0].id;
      const token = generateToken(userId);
      res.cookie('jwtToken', token, { httpOnly: true });
      res.json({ success: true, message: 'Signup successful',token });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];;
    console.log(token);
    const decoded = verifyToken(token);
    const userId = decoded.userId;
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1',[userId]);
    if (rows.length > 0) {
      console.log(rows[0]);
      res.json(rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profilse' });




  }
});




app.post('/api/logout', async (req, res) => {
  try {

      res.clearCookie('jwtToken');

      res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
      console.error('Error logging out:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// server.js
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    await pool.query('INSERT INTO password_reset_tokens (email, token) VALUES ($1, $2)', [email, token]);
    res.json({ success: true, message: 'Please Enter New Password ' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  try {
    // Check if the password reset token exists in the database
    const result = await pool.query('SELECT * FROM password_reset_tokens WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    const token = result.rows[0].token;
    // Update the user's password in the database
    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, email]);
    // Delete the password reset token from the database
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Add to cart endpoint
app.post('/api/cart/add/:productId', async (req, res) => {
  const productId = req.params.productId;
  const { quantity } = req.body; // Assuming the quantity is provided in the request body

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.userId;

    // Check if the product is already in the user's cart
    const existingCartItem = await pool.query('SELECT * FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);

    if (existingCartItem.rows.length > 0) {
      // If the product is already in the cart, update the quantity
      const updatedQuantity = existingCartItem.rows[0].quantity + quantity;
      await pool.query('UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [updatedQuantity, userId, productId]);
    } else {
      // If the product is not in the cart, insert it with the provided quantity
      await pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3)', [userId, productId, quantity]);
    }

    // Fetch the updated cart items for the user
    const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);
    const cartCountResult = await pool.query('SELECT COUNT(*) FROM cart WHERE user_id = $1', [userId]);
    const cartCount = cartCountResult.rows[0].count;
   console.log("svalue")
   
    res.json({ success: true, message: 'Product added to cart successfully', cartItems: cartItems.rows ,cartCount});

  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('/api/cart/count', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.userId;

    // Query the database to get the cart count for the user
    const cartCountResult = await pool.query('SELECT COUNT(*) FROM cart WHERE user_id = $1', [userId]);
    const cartCount = cartCountResult.rows[0].count;

    res.json({ success: true, cartCount });
  } catch (error) {
    console.error('Cart count error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



app.get('/api/cart', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.userId;

    // Query the database to get the cart items for the user
    const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);

    res.json({ success: true, cartItems: cartItems.rows });
  } catch (error) {
    console.error('Cart items fetch error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.delete('/api/cart/remove/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.userId;

    // Delete the product from the user's cart
    await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    console.log("deleted")

    // Query the database to get the updated cart items for the user
    const cartItems = await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId]);

    res.json({ success: true, cartItems: cartItems.rows });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/address', async (req, res) => {
  const { address, phoneNumber } = req.body;

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.userId;

    // Insert the address and phone number into the database
    await pool.query('INSERT INTO address (user_id, address, phone_number) VALUES ($1, $2, $3)', [userId, address, phoneNumber]);

    res.json({ success: true, message: 'Address added successfully' });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.get('/api/products/:productId', async (req, res) => {

  
  try {
    const productId = req.params.productId;
    const query = 'SELECT * FROM products WHERE id = $1';
    const { rows } = await pool.query(query, [productId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/order', async (req, res) => {
  const { items, deliveryDetails, paymentOption,totalPrice} = req.body;
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    const userId = decoded.userId;


      const queryText ='INSERT INTO orders (user_id, items, delivery_details, payment_option, order_date,total_price) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *';
      const values = [userId, items, deliveryDetails, paymentOption, new Date(),totalPrice];
      const result = await pool.query(queryText, values);
      await pool.query('DELETE FROM cart WHERE user_id = $1', [userId]);
      const order = result.rows[0];
     

      res.status(200).json({ success: true, message: 'Order placed successfully', order });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });



  app.get('/api/orders-history', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
  
      const userId = decoded.userId;
                  
      
      const { rows }=   await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
   
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No orders found for this user' });
      }

       // Map rows and parse JSONB items
    const ordersWithParsedItems = rows.map(order => ({
      orderId: order.order_id,
      userId: order.user_id,
      deliveryDetails: order.delivery_details,
      paymentOption: order.payment_option,
      orderDate: order.order_date,
      items: order.items, // Assuming items is stored in JSONB format
      totalPrice:order.total_price
    }));

      
  console.log("backend", ordersWithParsedItems)
      res.status(200).json({ success: true, orders:  ordersWithParsedItems });
    } catch (error) {
      console.error('Error getting order:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });



  //seller page code..........










  app.get('/api/productssell', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM productssell');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Error fetching data' });
    }
  });
  
  
  // Login endpoint
  app.post('/api/loginsell', async (req, res) => {
    const {email, password } = req.body;
    try {
      const result = await pool.query('SELECT * FROM userssell WHERE email = $1 AND password = $2', [email, password]);
      if (result.rows.length > 0) {
        const userId = result.rows[0].id;
        const token = generateToken(userId);
        res.cookie('jwtToken', token, { httpOnly: true });
  
        res.json({ success: true, message: 'Login successful', token });
      } else {
        res.status(401).json({ success: false, message: 'Enter Valid Email And Password' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'internal sever error' });
    }
  });
  
  // Signup endpoint
  app.post('/api/signupsell', async (req, res) => {
    const {username,email, password,gender } = req.body;
    try {
      console.log(username);
      const result = await pool.query('SELECT * FROM userssell WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        res.status(400).json({ success: false, message: 'Email already exists' });
      } else {
        await pool.query('INSERT INTO userssell (username,email, password,gender) VALUES ($1, $2,$3,$4)', [username,email, password,gender]);
        const insertedUser = await pool.query('SELECT id FROM userssell WHERE email = $1', [email]);
       
        const userId = insertedUser.rows[0].id;
        const token = generateToken(userId);
        res.cookie('jwtToken', token, { httpOnly: true });
        res.json({ success: true, message: 'Signup successful',token });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  app.get('/api/profilesell', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];;
      console.log(token);
      const decoded = verifyToken(token);
      const userId = decoded.userId;
      const { rows } = await pool.query('SELECT * FROM userssell WHERE id=$1',[userId]);
      if (rows.length > 0) {
        console.log(rows[0]);
        res.json(rows[0]);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Error fetching profilse' });
  
    }
  });
  
  
  
  
  app.post('/api/logoutsell', async (req, res) => {
    try {
  
        res.clearCookie('jwtToken');
  
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // server.js
  app.post('/api/forgot-passwordsell', async (req, res) => {
    const { email } = req.body;
    try {
      const result = await pool.query('SELECT id FROM userssell WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const token = crypto.randomBytes(20).toString('hex');
      await pool.query('INSERT INTO password_reset_tokenssell (email, token) VALUES ($1, $2)', [email, token]);
      res.json({ success: true, message: 'Please Enter New Password ' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  
  app.post('/api/reset-password-sell', async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;
    try {
      // Check if the password reset token exists in the database
      const result = await pool.query('SELECT * FROM password_reset_tokenssell WHERE email = $1', [email]);
      if (result.rows.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid email' });
      }
      const token = result.rows[0].token;
      // Update the user's password in the database
      await pool.query('UPDATE userssell SET password = $1 WHERE email = $2', [newPassword, email]);
      // Delete the password reset token from the database
      await pool.query('DELETE FROM password_reset_tokenssell WHERE token = $1', [token]);
      res.json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  
  // Add to cart endpoint
  app.post('/api/cart-sell/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    const { quantity } = req.body; // Assuming the quantity is provided in the request body
  
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
  
      const userId = decoded.userId;
  
      // Check if the product is already in the user's cart
      const existingCartItem = await pool.query('SELECT * FROM cartsell WHERE user_id = $1 AND product_id = $2', [userId, productId]);
  
      if (existingCartItem.rows.length > 0) {
        // If the product is already in the cart, update the quantity
        const updatedQuantity = existingCartItem.rows[0].quantity + quantity;
        await pool.query('UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [updatedQuantity, userId, productId]);
      } else {
        // If the product is not in the cart, insert it with the provided quantity
        await pool.query('INSERT INTO cartsell (user_id, product_id, quantity) VALUES ($1, $2, $3)', [userId, productId, quantity]);
      }
  
      // Fetch the updated cart items for the user
      const cartItems = await pool.query('SELECT * FROM cartsell WHERE user_id = $1', [userId]);
      const cartCountResult = await pool.query('SELECT COUNT(*) FROM cartsell WHERE user_id = $1', [userId]);
      const cartCount = cartCountResult.rows[0].count;
     console.log("svalue")
     
      res.json({ success: true, message: 'Product added to cart successfully', cartItems: cartItems.rows ,cartCount});
  
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  
  app.get('/api/cart-sell/count', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
  
      const userId = decoded.userId;
  
      // Query the database to get the cart count for the user
      const cartCountResult = await pool.query('SELECT COUNT(*) FROM cartsell WHERE user_id = $1', [userId]);
      const cartCount = cartCountResult.rows[0].count;
  
      res.json({ success: true, cartCount });
    } catch (error) {
      console.error('Cart count error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  
  
  app.get('/api/cart-sell', async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
  
      const userId = decoded.userId;
  
      // Query the database to get the cart items for the user
      const cartItems = await pool.query('SELECT * FROM cartsell WHERE user_id = $1', [userId]);
  
      res.json({ success: true, cartItems: cartItems.rows });
    } catch (error) {
      console.error('Cart items fetch error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  app.delete('/api/cart-sell/remove/:productId', async (req, res) => {
    const productId = req.params.productId;
  
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
  
      const userId = decoded.userId;
  
      // Delete the product from the user's cart
      await pool.query('DELETE FROM cartsell WHERE user_id = $1 AND product_id = $2', [userId, productId]);
      console.log("deleted")
  
      // Query the database to get the updated cart items for the user
      const cartItems = await pool.query('SELECT * FROM cartsell WHERE user_id = $1', [userId]);
  
      res.json({ success: true, cartItems: cartItems.rows });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  app.post('/api/address', async (req, res) => {
    const { address, phoneNumber } = req.body;
  
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
  
      const userId = decoded.userId;
  
      // Insert the address and phone number into the database
      await pool.query('INSERT INTO address (user_id, address, phone_number) VALUES ($1, $2, $3)', [userId, address, phoneNumber]);
  
      res.json({ success: true, message: 'Address added successfully' });
    } catch (error) {
      console.error('Add address error:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  
  
  
  
  app.get('/api/products-sell/:productId', async (req, res) => {
  
    
    try {
      const productId = req.params.productId;
      const query = 'SELECT * FROM productssell WHERE id = $1';
      const { rows } = await pool.query(query, [productId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
  app.post('/api/order-sell', async (req, res) => {
    const { items, deliveryDetails, paymentOption,totalPrice} = req.body;
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
      }
  
      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
      }
  
      const userId = decoded.userId;
  
  
        const queryText ='INSERT INTO orderssell (userid, items, delivery_details, payment_option, order_date,total_price) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *';
        const values = [userId, items, deliveryDetails, paymentOption, new Date(),totalPrice];
        const result = await pool.query(queryText, values);
        await pool.query('DELETE FROM cartsell WHERE user_id = $1', [userId]);
        const order = result.rows[0];
       
  
        res.status(200).json({ success: true, message: 'Order placed successfully', order });
      } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
  
  
  
    app.get('/api/orderssell-history', async (req, res) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
          return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }
    
        const decoded = verifyToken(token);
        if (!decoded) {
          return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
        }
    
        const userId = decoded.userId;
                    
        
        const { rows }=   await pool.query('SELECT * FROM orderssell WHERE userid = $1', [userId]);
     
        if (rows.length === 0) {
          return res.status(404).json({ error: 'No orders found for this user' });
        }
  
         // Map rows and parse JSONB items
      const ordersWithParsedItems = rows.map(order => ({
        orderId: order.orderid,
        userId: order.userid,
        deliveryDetails: order.delivery_details,
        paymentOption: order.payment_option,
        orderDate: order.order_date,
        items: order.items, // Assuming items is stored in JSONB format
        totalPrice:order.total_price
      }));
  
        
    console.log("backend", ordersWithParsedItems)
        res.status(200).json({ success: true, orders:  ordersWithParsedItems });
      } catch (error) {
        console.error('Error getting order:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    });
  
  




    

// ADMIN PAGE


app.get('/api/users-admin', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/api/userssell-admin', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM userssell');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});
app.get('/api/orders-admin', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders');

    const ordersWithParsedItems = rows.map(order => ({
      orderId: order.order_id,
      userId: order.user_id,
      deliveryDetails: order.delivery_details,
      paymentOption: order.payment_option,
      orderDate: order.order_date,
      items: order.items, // Assuming items is stored in JSONB format
      totalPrice:order.total_price
    }));

      console.log("valueeee",ordersWithParsedItems)
 
      res.status(200).json({ success: true, orders:  ordersWithParsedItems });
    
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

app.get('/api/orderssell-admin', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orderssell');


    const ordersWithParsedItems = rows.map(order => ({
      orderId: order.orderid,
      userId: order.userid,
      deliveryDetails: order.delivery_details,
      paymentOption: order.payment_option,
      orderDate: order.order_date,
      items: order.items, // Assuming items is stored in JSONB format
      totalPrice:order.total_price
      }));



      res.status(200).json({ success: true, orders:  ordersWithParsedItems });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});






const insertData = async (data) => {
  try {
    // Execute the SQL INSERT statement
    await pool.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [data.column1, data.column2, data.column3]);
    console.log('Data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

const dataToInsert = {
  column1: 'sri11',
  column2: 'hello@gmail.com',
  column3: 'value3'
};

// Call the function to insert data
//insertData(dataToInsert);



app.listen(port, () => {
  console.log('Backend server is running on port ${port}');
});