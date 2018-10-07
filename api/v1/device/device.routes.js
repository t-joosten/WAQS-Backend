const express = require('express');
const router = express.Router();

const device = require('./device.controller');

// Device routes
router.route('/')
  .get(device.GetDevices)
  .post(device.CreateDevice);

router.route('/:id')
  .get(device.GetDevice)
  .put(device.UpdateDevice)
  .delete(device.DeleteDevice);

router.route('/:id/measurements')
  .get(device.GetDeviceAndMeasurements);

module.exports = router;
