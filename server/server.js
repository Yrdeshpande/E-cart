// Backend: server.js
const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken package
const EcartModel = require('./models/Ecart')
const path = require('path');

const app = express();
const port = 5000;
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://host.docker.internal:27017/ecart")


// Secret key for JWT generation
const JWT_SECRET = 'your-secret-key'; // Replace with a more secure secret

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  EcartModel.findOne({ username: username })
    .then(user => {
      if (user) {
        if (user.password === password) {
          // Generate a JWT token
          const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

          // Respond with the token and user details
          return res.json({ token, username: user.username });
        } else {
          res.status(401).json({ message: "Incorrect password" });
        }
      } else {
        res.status(404).json({ message: "No record existed" });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'An error occurred while processing your request.' });
    });
});

// Register route (no changes needed)
app.post('/register', (req, res) => {
  EcartModel.create(req.body)
    .then(ecarts => res.json(ecarts))
    .catch(err => res.json(err));
});

// Mock product data
const productsData = {
  mobiles: [
    {
      id: 1,
      name: "Samsung Galaxy S23",
      price: 34999,
      description: "8 GB RAM | 128 GB ROM 16.26 cm (6.4 inch) Full HD+ Display50MP + 12MP | 10MP Front Camera4500 mAh BatterySamsung Exynos 2200 Processor",
      image: "/images/mobiles/s23.jpg",
    },
    {
      id: 2,
      name: "Apple iPhone 14 (Starlight, 256 GB)",
      price: 69990,
      description: "256 GB ROM |15.49 cm (6.1 inch) Super Retina XDR Display |12MP + 12MP | 12MP Front Camera A15 Bionic Chip, 6 Core Processor Processor",
      image: "/images/mobiles/iphone14.jpg",
    },
    {
      id: 3,
      name: "OnePlus 12R (Iron Gray, 8 GB RAM, 256 GB Storage)",
      price: 38999,
      description: "OnePlus 12R (Iron Gray, 8 GB RAM, 256 GB Storage)",
      image: "/images/mobiles/OnePlus12R.jpg",
    },
    {
      id: 4,
      name: "Redmi Note 14 5G (Mystique White, 6GB RAM 128GB Storage)",
      price: 18999,
      description: "Redmi Note 14 5G (Mystique White, 6GB RAM 128GB Storage) | Global Debut MTK Dimensity 7025 Ultra | 2100 nits Segment Brightest 120Hz AMOLED | 50MP Sony LYT 600 OIS+EIS Triple Camera",
      image: "/images/mobiles/Redminote14.jpg",
    },
  ],
  // Add other categories here...
  laptops: [
    {
      id: 5,
      name: "HP Pavilion Intel Core i5 12th Gen 1235U",
      price: 54999,
      description: "HP Pavilion Intel Core i5 12th Gen 1235U - (16 GB/512 GB SSD/Windows 11 Home) 14-dv2014TU Thin and Light Laptop (14 inch, Natural Silver, 1.41 Kg, With MS Office)",
      image: "/images/laptops/hp.jpg",
    },
    {
      id: 6,
      name: "DELL XPS 13 Intel Core i7 8th Gen 8550U",
      price: 93990,
      description: "DELL XPS 13 Intel Core i7 8th Gen 8550U - (16 GB/512 GB SSD/Windows 10 Home) 9370 Thin and Light Laptop (13.3 inch, Gold, 1.21 kg, With MS Office)",
      image: "/images/laptops/dell.jpg",
    },
  ],
  accessories: [
    {
      id: 7,
      name: "boAt Airdopes 161/163",
      price: 1099,
      description: "boAt Airdopes 161/163 with ASAP Charge & 40 HRS Playback Bluetooth (Pebble Black, Active Black, True Wireless)",
      image: "/images/accessories/boatairdopes.jpg",
    },
    {
      id: 8,
      name: "Fire-Boltt Ninja Talk 35.3mm",
      price: 1599,
      description: "Fire-Boltt Ninja Talk 35.3mm (1.39) Round Bluetooth Calling Metal Body, 120 Sports Modes Smartwatch (Grey Strap, 1.39)",
      image: "/images/accessories/watch.jpg",
    },
  ],
  clothing: [
    {
      id: 9,
      name: "Men Full Sleeve Graphic Print Hooded Sweatshirt",
      price: 449,
      description: "Comfortable and stylish cotton Men Full Sleeve Graphic Print Hooded Sweatshirt.",
      image: "/images/clothing/sweetshirt.jpg",
    },
    {
      id: 10,
      name: "Round Neck Polyester T-Shirt",
      price: 399,
      description: "Pack of 2 Men Printed Round Neck Polyester Multicolor T-Shirt",
      image: "/images/clothing/tshirt.jpg",
    },
  ],
};

// Serve static files from the public folder
app.use('/images', express.static(path.join(__dirname, 'http://localhost:3000/images/')));

// API endpoint to fetch product details by category and productId

app.get('/api/products/:category', (req, res) => {
  const { category } = req.params;

  const categoryProducts = productsData[category];
  if (!categoryProducts) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json(categoryProducts);
});

// API endpoint to fetch product details by category and productId
app.get('/api/products/:category/:productId', (req, res) => {
  const { category, productId } = req.params;

  const categoryProducts = productsData[category];
  if (!categoryProducts) {
    return res.status(404).json({ message: 'Category not found' });
  }

  const product = categoryProducts.find((item) => item.id === parseInt(productId));
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json(product);
});

//Cart route
app.post('/cart/:username', async (req, res) => {
  const { username } = req.params;
  const { productId, name, price, image } = req.body;

  try {
    const user = await EcartModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingItem = user.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity if item exists
    } else {
      user.cart.push({ productId, name, price, image }); // Add new item to cart
    }

    await user.save();
    res.status(201).json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

app.get('/cart/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await EcartModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch cart items" });
  }
});

app.put('/cart/:username/:productId', async (req, res) => {
  const { username, productId } = req.params;
  const { quantity } = req.body;

  try {
    const user = await EcartModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const item = user.cart.find(item => item.productId === parseInt(productId));
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

app.delete('/cart/:username/:productId', async (req, res) => {
  const { username, productId } = req.params;

  try {
    const user = await EcartModel.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(item => item.productId !== parseInt(productId));
    await user.save();
    res.json(user.cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete cart item" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on:${port}`);
});