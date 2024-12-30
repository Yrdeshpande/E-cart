const mongoose = require('mongoose');

const EcartSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
      image: { type: String },
    },
  ],
});

const EcartModel = mongoose.model("ecarts", EcartSchema);
module.exports = EcartModel;
