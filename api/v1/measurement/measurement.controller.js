const mongoose = require('mongoose');
const Measurement = require('./measurement.model');

exports.GetMeasurements = (req, res) => {
  Measurement.find({}, (err, task) => {
    if (err) res.send(err);
    res.json(task);
  });
};

exports.GetMeasurementsByDevice = (req, res) => {
  const deviceId = req.params.device_id;
  // const firstDate = req.params.first_date;
  // const lastDate = req.params.last_date;

  Measurement
    .where('device_id', deviceId)
    // .where('createdAt').gte(firstDate).lte(lastDate)
    .exec((err, result) => {
      if (err) res.send(err);
      res.json(result);
    });
};

exports.GetLastMeasurementByDevice = (req, res) => {
  const deviceId = req.params.device_id;

  Measurement.findOne({ device_id: deviceId }).sort({ createdAt: -1 }).exec((err, result) => {
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
  }
};
