const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const measurementSchema = new mongoose.Schema({
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  values: {},
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

module.exports = mongoose.model('Measurement', measurementSchema);
