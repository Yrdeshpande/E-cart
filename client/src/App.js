import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';
import Shop from './components/Shop';
import Login from './components/Login';
import Signup from './components/Signup';
import Cart from './components/Cart';

function App() {
  const [userToken, setUserToken] = useState(null);
  const [username, setUsername] = useState('');
  const [showLogout, setShowLogout] = useState(false); // State to manage logout button visibility
  const navigate = useNavigate();

  // Check if user is logged in on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token) {
      setUserToken(token);
      setUsername(storedUsername || '');
    }
  }, []);

  // Update user state
  const setUser = ({ token, username }) => {
    setUserToken(token);
    setUsername(username);
  };

  // Logout Functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUserToken(null);
    setUsername('');
    setShowLogout(false); // Hide the logout button after logout
    navigate('/login'); // Redirect to login page
  };

  // Toggle logout button visibility
  const toggleLogout = () => {
    setShowLogout(prevState => !prevState);
  };

 return (
  <div>
    <nav>
      <div>
        <h1>React E-commerce</h1>
      </div>
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/shop" className="nav-link">
            <div className="nav-icon">
              <img
                src="/images/assets/home.png"
                alt="Shop Logo"
                className="nav-logo"
              />
            </div>
            <span>Home</span>
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/cart" className="nav-link">
            <div className="nav-icon">
              <img
                src="/images/assets/cart.png"
                alt="Cart Logo"
                className="nav-logo"
              />
            </div>
            <span>Cart</span>
          </Link>
        </li>

        {userToken ? (
          <>
            <li className="nav-item">
              <span
                onClick={toggleLogout}
                style={{ cursor: 'pointer', color: '#007BFF' }}
              >
                <div className="nav-icon">
                  <img
                    src="/images/assets/user.png"
                    alt="User Logo"
                    className="nav-logo"
                  />
                </div>
                Hello, {username}
              </span>
              {showLogout && (
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              )}
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              <div className="nav-icon">
                <img
                  src="/images/assets/user.png"
                  alt="User Logo"
                  className="nav-logo"
                />
              </div>
              <span>Login</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>

    <div className="content">
      <Routes>
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:category" element={<CategoryPage />} />
        <Route path="/shop/:category/:productId" element={<ProductDetail userToken={userToken} />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
          {/* Cart Route with Empty Cart Message and Image */}
          <Route
            path="/cart"
            element={
              userToken ? (
                <Cart />
              ) : (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <img
                    src="/images/assets/empty-cart.png" // Replace with your empty cart image path
                    alt="Empty Cart"
                    style={{ width: '200px', marginBottom: '0px' }}
                  />
                  <div>
                    <h4>Missing Cart items?</h4>
                    <p>Login to see the items you added previously.</p></div>
                </div>
              )
            }
          />
        <Route path="/" element={<Shop />} />
      </Routes>
    </div>
  </div>
);
}

export default App;