import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMobileAlt, faLaptop, faHeadphones, faTshirt } from '@fortawesome/free-solid-svg-icons';
import '../App.css';

function Shop() {
  return (
    <div className="home">
      <h2>Shop by Categories</h2>
      <ul className="categories">
        <li>
          <Link to="/shop/mobiles">
            <FontAwesomeIcon icon={faMobileAlt} /> Mobiles
          </Link>
        </li>
        <li>
          <Link to="/shop/laptops">
            <FontAwesomeIcon icon={faLaptop} /> Laptops
          </Link>
        </li>
        <li>
          <Link to="/shop/accessories">
            <FontAwesomeIcon icon={faHeadphones} /> Accessories
          </Link>
        </li>
        <li>
          <Link to="/shop/clothing">
            <FontAwesomeIcon icon={faTshirt} /> Clothing
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Shop;
