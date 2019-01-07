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
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
  deviceValuesUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  sensorValuesUpdatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

Device.plugin(mongoosePaginate);

module.exports = mongoose.model('Device', Device);
