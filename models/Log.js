const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  message: {},
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Log', logSchema);
