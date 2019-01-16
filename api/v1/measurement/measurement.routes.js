const express = require('express');
const router = express.Router();

const measurement = require('./measurement.controller');

// Measurement routes
router.route('/')
  .get(measurement.GetMeasurements);
// .post(device.CreateDevice);

router.route('/:id')
  .get(measurement.GetMeasurementsByDevice);

router.route('/:id/last')
  .get(measurement.GetLastMeasurementsByDevice);

router.route('/:id/three-days')
  .get(measurement.GetLastThreeDayMeasurements);

module.exports = router;
