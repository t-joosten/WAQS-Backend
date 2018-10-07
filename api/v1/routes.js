const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Log = mongoose.model('Log');

const deviceRoutes = require('./device/device.routes');
const measurementRoutes = require('./measurement/measurement.routes');

router.get('/', (req, res) => {
  res.status(200).json({ message: 'The API v1 is active.' });
});

router.get('/logs', (req, res) => {
  Log.find({}).sort({ createdAt: 'desc' }).exec((err, logs) => {
    res.send(logs);
  });
});

router.use('/devices', deviceRoutes);
router.use('/measurements', measurementRoutes);

module.exports = router;
