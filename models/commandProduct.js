const mongoose = require('mongoose');

const commandProductSchema = new mongoose.Schema({
  commandId: {
    type: String,
    required: true,
   
  },
  productId: {
    type: String,
    required: true,
    
  },
  productName: {
    type: String,
    required: true,
    
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Assuming price should be a non-negative value
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Assuming quantity should be at least 1
  },

});

const CommandProduct = mongoose.models.CommandProduct || mongoose.model('CommandProduct', commandProductSchema);

module.exports = CommandProduct;
