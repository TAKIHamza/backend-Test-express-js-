const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
 
  clientId: {
    type: String,
    required: true,
  },
  numberOfProducts: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const Command = mongoose.models.Command || mongoose.model('Command', commandSchema);

module.exports = Command;
