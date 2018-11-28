const mongoose = require('mongoose');
const Measurement = require('./measurement.model');
const Device = require('../device/device.model');

exports.GetMeasurements = (req, res) => {
  try {
    Measurement.find({}, (err, task) => {
      if (err) res.send(err);
      res.json(task);
    });
  } catch (err) {
    res.json({ message: 'Something went wrong with getting the measurements.' });
  }
};

exports.GetMeasurementsByDevice = (req, res) => {
  const deviceId = req.params.id;
  // const firstDate = req.params.first_date;
  // const lastDate = req.params.last_date;
  try {
    Measurement
      .find({ device: deviceId })
      // .where('createdAt').gte(firstDate).lte(lastDate)
      .exec((err, result) => {
        if (err) res.send(err);
        res.json(result);
      });
  } catch (err) {
    res.json({ message: 'Something went wrong with getting the measurements.' });
  }
};

exports.GetLastMeasurementByDevice = (req, res) => {
  const deviceId = req.params.id;

  Measurement.findOne({ device: deviceId }).sort({ createdAt: -1 }).exec((err, result) => {
    if (err) res.send(err);
    res.json(result);
  });
};

exports.CreateMeasurement = async (newMeasurement) => {
  try {
    let measurement;

    await newMeasurement.save((err, createdMeasurement) => {
      measurement = createdMeasurement;
    });

    return measurement;
  } catch (err) {
    console.log(err);
    return { message: 'Could not create measurement.' };
  }
};
