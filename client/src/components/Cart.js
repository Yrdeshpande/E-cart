import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Import the CSS file

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCartItems = async () => {
      // Retrieve the username from localStorage (or use a state if needed)
      const username = localStorage.getItem('username');

      if (!username) {
        setError('User not logged in');
        return;
      }

      try {
        const response = await axios.get(`http://backend:5000/cart/${username}`);
        setCartItems(response.data);
      } catch (err) {
        console.error('Error fetching cart items:', err);
        setError('Failed to fetch cart items');
      }
    };

    fetchCartItems();
  }, []);

  // Function to format price with ₹ symbol
const formatPrice = (price) => {
  return '₹' + price.toLocaleString('en-IN');
};

// Function to handle removing a product from the cart
const removeProduct = async (productId) => {
  const username = localStorage.getItem('username');
  if (!username) {
    setError('User not logged in');
    return;
  }

  try {
    await axios.delete(`http://backend:5000/cart/${username}/${productId}`);
    // Remove the item from the cart state
    setCartItems(cartItems.filter((item) => item.productId !== productId));
  } catch (err) {
    console.error('Error removing product:', err);
    setError('Failed to remove product. Please try again.');
  }
};

  return (
    <div className="center-page"> {/* Apply centering */}
      <div className="cart-container">
        <h1>My Cart</h1>
        {error && <p className="error-message">{error}</p>}
        <ul className="cart-list">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
            <img
              src="/images/assets/empty-cart.png" // Replace with your empty cart image path
              alt="Empty Cart"
              style={{ width: '200px', marginBottom: '0px' }}
            />
            
              <h4>Your cart is empty! Add items to the cart.</h4>
            </div>
          ) : (
            cartItems.map((item) => (
              <li key={item.productId} className="cart-item">
                <img src={item.image} alt={item.name} className="product-image" /> {/* Product image */}
                <div className="cart-item-details">
                  <span>{item.name}</span>
                  <span>{formatPrice(item.price)}</span> {/* Formatted price with INR */}
                  <span>Quantity: {item.quantity}</span>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeProduct(item.productId)}>Remove</button>
              </li>
              ))
            )}
        </ul>
      </div>
    </div>
  );
};

export default Cart;
