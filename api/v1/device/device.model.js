const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
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
  battery: {
    type: Number,
    default: 0,
  },
  alt: {
    type: Number,
    default: 0,
  },
  lat: {
    type: Number,
    default: 0,
  },
  long: {
    type: Number,
    default: 0,
  },
  deviceValuesUpdatedAt: {
    type: Date,
    default: null,
  },
  sensorValuesUpdatedAt: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

Device.plugin(mongoosePaginate);

module.exports = mongoose.model('Device', Device);
