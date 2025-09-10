const mongoose = require('mongoose');

const shoppingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  category: {
    type: String,
    enum: ['dairy', 'produce', 'meat', 'bakery', 'snacks', 'beverages', 'household', 'other'],
    default: 'other'
  },
  completed: {
    type: Boolean,
    default: false
  },
  addedByVoice: {
    type: Boolean,
    default: false
  },
  voiceCommand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    default: null
  },
  brand: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShoppingItem', shoppingItemSchema);
