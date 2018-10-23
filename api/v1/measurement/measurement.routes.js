const express = require('express');
const router = express.Router();

const device = require('./measurement.controller');

// Device routes
router.route('/')
  .get(device.GetMeasurements);
// .post(device.CreateDevice);

router.route('/:id')
  .get(device.GetMeasurementsByDevice);

router.route('/:id/last')
  .get(device.GetLastMeasurementByDevice);

module.exports = router;
