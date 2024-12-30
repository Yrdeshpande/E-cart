import React from 'react';
import './ProductCard.css'; // Import styling (you can create a separate CSS file for the ProductCard)

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={`/images/${product.image}`} alt={product.name} className="product-image" />
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>
      <button 
        className="add-to-cart-button" 
        onClick={() => onAddToCart(product.id)}
        >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
