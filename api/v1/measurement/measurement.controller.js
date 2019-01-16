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

exports.GetMeasurementsByDevice = async (req, res) => {
  try {
    const deviceId = req.params.id;

    // const firstDate = req.params.first_date;
    // const lastDate = req.params.last_date;

    await Measurement.find({ deviceId })
    // .where('createdAt').gte(firstDate).lte(lastDate)
      .exec((err, result) => {
        if (err) res.status(404).send(err);
        res.json(result);
      });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong with getting the measurements.' });
  }
};

exports.GetLastMeasurementsByDevice = (req, res) => {
  const deviceId = req.params.id;
  console.log(deviceId);

  Promise.all([
    Measurement.findOne({
      deviceId,
      gateId: 1,
    }).sort({ createdAt: -1 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({
      deviceId,
      gateId: 2,
    }).sort({ createdAt: -1 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({
      deviceId,
      gateId: 3,
    }).sort({ createdAt: -1 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({
      deviceId,
      gateId: 4,
    }).sort({ createdAt: -1 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({
      deviceId,
      gateId: 5,
    }).sort({ createdAt: -1 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({
      deviceId,
      gateId: 6,
    }).sort({ createdAt: -1 }).select('gateId value substanceId createdAt').exec(),
  ])
    .then((results) => {
      // console.log(results);
      const measurements = results.filter(el => el != null);
      res.json(measurements);
    })
    .catch((err) => {
      console.error('Something went wrong', err);
    });
};

exports.GetLastThreeDayMeasurements = (req, res) => {
  const deviceId = req.params.id;
  console.log(deviceId);

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  Promise.all([
    Measurement.findOne({ deviceId, gateId: 1 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({ deviceId, gateId: 2 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({ deviceId, gateId: 3 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({ deviceId, gateId: 4 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({ deviceId, gateId: 5 }).select('gateId value substanceId createdAt').exec(),
    Measurement.findOne({ deviceId, gateId: 6 }).select('gateId value substanceId createdAt').exec(),
  ])
    .then((results) => {
      const measurements = results.filter(el => el != null);
      const measurementPromises = [];

      measurements.forEach((measurement) => {
        measurementPromises.push(Measurement.find({
          deviceId,
          gateId: measurement.gateId,
          substanceId: measurement.substanceId,
          createdAt: { $gte: addDays(new Date(), -7), $lt: new Date() },
        }).sort({ createdAt: -1 }).exec());
      });

      Promise.all(measurementPromises)
        .then((data) => {
          console.log(results);
          res.json(data);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.error('Something went wrong', err);
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
