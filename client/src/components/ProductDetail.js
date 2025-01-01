import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../App.css';

const ProductsDetail = ({ userToken }) => {
  const { category, productId } = useParams(); // Get category and productId from URL
  const [product, setProduct] = useState(null); // State to hold the product details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [cartMessage, setCartMessage] = useState(''); // State to show success/error messages for cart

  useEffect(() => {
    // Fetch product details from the backend
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://app.yogiraj.tech/backend/api/products/${category}/${productId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product details:', err.message);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [category, productId]);

  // Handle Add to Cart
  const handleAddToCart = async () => {
    if (!userToken) {
      alert('Please log in to add items to your cart.');
      return;
    }
  
    // Retrieve username from localStorage (or from your state if stored differently)
    const username = localStorage.getItem('username');
    if (!username) {
      alert('User not logged in');
      return;
    }
  
    try {
      const response = await fetch(`http://app.yogiraj.tech/backend/cart/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add product to cart.');
      }
  
      setCartMessage('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      setCartMessage('Failed to add product to cart. Please try again.');
    }
  };  

  // Handle loading state
  if (loading) {
    return <p>Loading product details...</p>;
  }

  // Handle error state
  if (error) {
    return <p>{error}</p>;
  }

  // If product is not found
  if (!product) {
    return <p>Product not found.</p>;
  }

  // Format the price in INR currency format
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(product.price);

  return (
    <div className="product-detail">
      <img src={`/images/${product.image}`} alt={product.name} className="product-image" />
      <h2>{product.name}</h2>
      <p className="price">{formattedPrice}</p>
      <p>{product.description}</p>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
      {cartMessage && <h4 className="cart-message">{cartMessage}</h4>}
    </div>
  );
};

export default ProductsDetail;
