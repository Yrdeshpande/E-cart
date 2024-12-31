import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const CategoryPage = () => {
  const { category } = useParams(); // Get category and productId from URL
  const [products, setProducts] = useState([]); // State to hold products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch products for the given category from the backend
        const response = await axios.get(`http://backend:5000/api/products/${category}`);
        setProducts(response.data); // Set the fetched data
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Handle loading state
  if (loading) {
    return <p>Loading products...</p>;
  }

  // Handle error state
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="category">
      <h2>Category: {category.charAt(0).toUpperCase() + category.slice(1)}</h2>

      <div className="product-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="product-card" key={product.id}>
              <img src={`${process.env.PUBLIC_URL}${product.image}`} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}</p>
              <Link to={`/shop/${category}/${product.id}`} className="view-details">View Details</Link>
            </div>
          ))
        ) : (
          <p>No products available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;