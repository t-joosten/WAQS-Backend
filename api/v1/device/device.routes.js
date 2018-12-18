const express = require('express');
const router = express.Router();

const VerifyToken = require('../../../helpers/VerifyToken');
const device = require('./device.controller');

// Device routes
router.route('/')
  .get(device.GetDevices)
  .post(device.CreateDevice);

router.get('/:id', device.GetDevice);
router.put('/:id', VerifyToken, device.UpdateDevice);
router.delete('/:id', VerifyToken, device.DeleteDevice);

router.route('/:id/measurements')
  .get(device.GetDeviceAndMeasurements);

module.exports = router;
