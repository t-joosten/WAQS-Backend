const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSchema = new mongoose.Schema({
  deviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Device',
  },
  gateId: {
    type: Number,
  },
  measuredTypeId: {
    type: Number,
  },
  value: {
    type: Number,
  },
  createdAt: {
    type: Date,
  },
}, {
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
});

module.exports = mongoose.model('Measurement', measurementSchema);
