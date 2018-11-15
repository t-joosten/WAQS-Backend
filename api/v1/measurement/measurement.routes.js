const express = require('express');
const router = express.Router();

const measurement = require('./measurement.controller');

// Device routes
router.route('/')
  .get(measurement.GetMeasurements);
// .post(device.CreateDevice);

router.route('/:id')
  .get(measurement.GetMeasurementsByDevice);

router.route('/:id/last')
  .get(measurement.GetLastMeasurementByDevice);

module.exports = router;
