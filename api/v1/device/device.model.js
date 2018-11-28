const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Device = new mongoose.Schema({
  name: {
    type: String,
  },
  appId: {
    type: String,
  },
  devId: {
    type: String,
  },
  hardwareSerial: {
    type: String,
  },
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Device', Device);
