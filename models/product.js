// models/Product.js
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
  
  price: {
    type: Number,
    
  },
  category: {
    type: String,
    
  },
  image: {
    type: String,
  
  },

});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports =  Product;
